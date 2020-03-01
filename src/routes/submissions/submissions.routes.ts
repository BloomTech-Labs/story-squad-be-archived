import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Transcribable, Transcription, Readability, Readable } from '../../models/internal/DS';
import { runScript } from '../../util/scripts/scripting';
import { attemptJSONParse, onlyTranscription } from '../../util/utils';
import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Child, Submissions } from '../../database/entity';
import { Pages } from '../../database/entity/Pages';

const submissionRoutes = Router();

submissionRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { submissions } = req.user as Child;
        res.json({ submissions });
    } catch (err) {
        res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

submissionRoutes.get('/:week', Only(Child), async (req, res) => {
    try {
        const { submissions } = req.user as Child;
        const submission = submissions.find(({ week }) => week === parseInt(req.params.week));
        if (!submission) throw Error('404');
        res.json({ submission });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json({ message: `Submission not found` });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

submissionRoutes.post('/', Only(Child), async (req, res) => {
    try {
        const { storyText, illustration, story } = res.locals.body as Submissions;

        const { cohort, submissions } = req.user as Child;
        const { week } = cohort;

        if (submissions.find((e) => e.week === week)) throw Error('400');

        // Start DS integration
        let images = [];
        Object.values(story).forEach((page) => {
            if (page.length > 1) {
                images.push(page);
            }
        });

        const data = {
            images,
        };

        const transcribed: Transcription | any = await transcribe(data);

        if (!transcribed) {
            res.status(400).json({ message: 'Something went wrong transcribing image.' });
        }

        transcribed.images.forEach((story: string) => {
            readable({ story })
                .then((stats: Readability) => {
                    // Save readability stats to db
                    // Save transcribed text to db
                    // await getRepository(readability, connection()).save({
                    //     ...stats,
                    //     transcribed_text: story
                    // })
                    console.log(stats);
                })
                .catch(console.error);
        });
        // End DS integration

        // START OLD DB CODE
        // This will get replaced on the next merge with new database code
        const { child, ...submission } = await getRepository(Submissions, connection()).save({
            week,
            story,
            storyText,
            illustration,
            child: req.user,
        });
        // END OLD DB CODE

        // NEW DB CODE
        // await getRepository(story_submissions, connection()).save({
        //     child_id: req.user.id,
        //     cohorts_chapter_id: week,
        //     image: JSON.stringify(data)
        // })
        // END NEW DB CODE

        res.status(201).json({ submission, transcribed });
    } catch (err) {
        if (err.toString() === 'Error: 400')
            res.status(400).json({ message: `Submission already exists` });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

submissionRoutes.delete('/:week', Only(Child), async (req, res) => {
    try {
        const reqWeek = parseInt(req.params.week);

        const { submissions } = req.user as Child;
        const submission = submissions.find(({ week }) => week === reqWeek);
        if (!submission) throw Error('404');

        const { affected } = await getRepository(Submissions, connection()).delete({
            week: reqWeek,
        });
        if (!affected) throw Error();

        res.json({ submission });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json({ message: `Submission not found` });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

// Wrapper function that runs a specific script
// Parameters<typeof runScript>[1] is used to specify the second parameter type of `runScript`
function transcribe(data: Transcribable) {
    return runScript(
        './src/util/scripts/transcription.py', // Specifies the script to use, the path is relative to the directory the application is started from
        data, // The data to pass into stdin of the script
        (out: string[]) => out.map(attemptJSONParse).find(onlyTranscription) // A function to take the stdout of the script and find the result
    );
}

function readable(story: Readable) {
    return runScript(
        './src/util/scripts/readability.py', // Specifies the script to use, the path is relative to the directory the application is started from
        story, // The data to pass into stdin of the script
        (out: any) => out.map(attemptJSONParse) // A function to take the stdout of the script
    );
}

export { submissionRoutes };
