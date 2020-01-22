import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Child, Submissions } from '../../database/entity';

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
        // To Do: add DTO to validation and set res.locals.submission
        // To Do: disallow posting duplicate week
        const submissionDTO = req.body as Submissions;
        const { story, storyText, illustration } = submissionDTO;

        const { week } = req.user as Child;

        const { child, ...submission } = await getRepository(Submissions, connection()).save({
            week,
            story,
            storyText,
            illustration,
            child: req.user,
        });
        res.status(201).json({ submission });
    } catch (err) {
        res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

submissionRoutes.put('/:id', Only(Child), async (req, res) => {
    try {
        // To Do: add DTO to validation and set res.locals.submission
        const submissionDTO = req.body as Submissions;
        const reqID = parseInt(req.params.id);

        const { submissions } = req.user as Child;
        const oldSubmission = submissions.find(({ id }) => id === reqID);
        if (!oldSubmission) throw Error('404');

        const { affected } = await getRepository(Submissions, connection()).update(
            reqID,
            submissionDTO
        );
        if (!affected) throw Error();

        res.json({ submission: { ...oldSubmission, submissionDTO } });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json({ message: `Submission not found` });
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

export { submissionRoutes };
