import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Child, Submission } from '../../database/entity';
import { SubmissionDTO } from '../../models';

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
        const { story, storyText, illustration } = res.locals.body as Submission;

        const { cohort, submissions } = req.user as Child;
        const { week } = cohort;

        if (submissions.find((e) => e.week === week)) throw Error('400');

        const { child, ...submission } = await getRepository(Submission, connection()).save({
            week,
            story,
            storyText,
            illustration,
            child: req.user,
        });

        res.status(201).json({ submission });
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

        const { affected } = await getRepository(Submission, connection()).delete({
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
