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

submissionRoutes.get('/:id', Only(Child), async (req, res) => {
    try {
        const { submissions } = req.user as Child;
        const submission = submissions.find(({ id }) => id === parseInt(req.params.id));
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
        const submissionDTO = req.body as Submissions;

        const submission = await getRepository(Submissions, connection()).save(submissionDTO);
        res.status(201).json({ submission });
    } catch (err) {
        res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

submissionRoutes.put('/:id', Only(Child), async (req, res) => {
    try {
        // To Do: add DTO to validation and set res.locals.submission
        const submissionDTO = req.body as Submissions;
        const id = parseInt(req.params.id);

        const { submissions } = req.user as Child;
        const oldSubmission = submissions.find(({ id }) => id === parseInt(req.params.id));
        if (!oldSubmission) throw Error('404');

        const submission = await getRepository(Submissions, connection()).update(id, submissionDTO);
        res.json({ submission });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json({ message: `Submission not found` });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

submissionRoutes.delete('/:id', Only(Child), async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const { submissions } = req.user as Child;
        const submission = submissions.find(({ id }) => id === parseInt(req.params.id));
        if (!submission) throw Error('404');

        const { affected } = await getRepository(Submissions, connection()).delete(id);
        if (!affected) throw Error();

        res.json({ submission });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json({ message: `Submission not found` });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});
