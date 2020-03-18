import { Router } from 'express';
import { getRepository } from 'typeorm';
import {
    Transcribable,
    Transcription,
    Readability,
    Readable,
    WeekMatches,
} from '../../models/internal/DS';
import { runScript } from '../../util/scripts/scripting';
import { attemptJSONParse, onlyTranscription } from '../../util/utils';
import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Child, Stories } from '../../database/entity';
import { Pages } from '../../database/entity/Pages';

const storyRoutes = Router();

storyRoutes.get('/:week', Only(Child), async (req, res) => {
    try {
        const { stories } = req.user as Child;
        const story = stories.find(({ week }) => week === parseInt(req.params.week));
        if (!story) throw Error('404');
        return res.json({ story });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            return res.status(404).json({ message: `Submission not found` });
        else
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

storyRoutes.post('/', Only(Child), async (req, res) => {
    try {
        const { storyText, story } = res.locals.body as Stories;

        const { cohort, stories } = req.user as Child;
        const { week } = cohort;

        if (stories.find((e) => e.week === week)) throw Error('400');

        let images = [];
        Object.values(story).forEach((page) => {
            if (page.length > 1) {
                images.push(page);
            }
        });

        let transcribed: Transcription | any;
        let readabilityStats: Readability | Transcription | WeekMatches;

        try {
            transcribed = await transcribe({ images });
        } catch (err) {
            console.log(err.toString());
            res.status(500).json({
                err: err.toString(),
                message: 'Could not transcribe story images',
            });
        }

        //added WeekMatches as in DS.ts to stop typescript from throwing error
        readabilityStats = await readable({
            story: transcribed.images[0],
        });

        readabilityStats = {
            flesch_reading_ease: NaN,
            smog_index: NaN,
            flesch_kincaid_grade: NaN,
            coleman_liau_index: NaN,
            automated_readability_index: NaN,
            dale_chall_readability_score: NaN,
            difficult_words: NaN,
            linsear_write_formula: NaN,
            gunning_fog: NaN,
            consolidated_score: 'n/a',
            doc_length: NaN,
            quote_count: NaN,
        };

        try {
            const { child, ...stories } = await getRepository(Stories, connection()).save({
                week,
                story,
                storyText,
                child: req.user,

                ...readabilityStats[0],
                transcribed_text: transcribed
                    ? {
                          t_page1: transcribed.images[0] ? transcribed.images[0] : '',
                          t_page2: transcribed.images[1] ? transcribed.images[1] : '',
                          t_page3: transcribed.images[2] ? transcribed.images[2] : '',
                          t_page4: transcribed.images[3] ? transcribed.images[3] : '',
                          t_page5: transcribed.images[4] ? transcribed.images[4] : '',
                      }
                    : null,
            });

            return res.status(201).json({ transcribed, stories });
        } catch (err) {
            console.log(err.toString());
            return res.status(500).json({ message: err.toString() });
        }
    } catch (err) {
        if (err.toString() === 'Error: 400')
            return res.status(400).json({ message: `Submission already exists` });
        else
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

storyRoutes.delete('/:week', Only(Child), async (req, res) => {
    // need to uncheck progress upon delete
    try {
        const reqWeek = parseInt(req.params.week);

        const { stories } = req.user as Child;
        const story = stories.find((submission) => {
            return reqWeek === submission.week;
        });

        if (!story) throw Error('404');
        try {
            await getRepository(Stories, connection()).delete({
                week: reqWeek,
            });
        } catch (err) {
            console.log(err.toString());
            return res.status(500).json({
                err: err.toString(),
                message: 'Could not resolve delete query',
            });
        }

        return res.json({ story });
    } catch (err) {
        if (err.toString() === 'Error: 404') {
            return res.status(404).json({ message: `Story not found` });
        } else {
            return res
                .status(500)
                .json({ message: 'Hmm... That did not work, please try again later.' });
        }
    }
});

function transcribe(data: Transcribable) {
    return runScript('./src/util/scripts/transcription.py', data, (out: string[]) =>
        out.map(attemptJSONParse).find(onlyTranscription)
    );
}

function readable(story: Readable) {
    return runScript('./src/util/scripts/readability.py', story, (out: any) =>
        out.map(attemptJSONParse)
    );
}

export { storyRoutes };
