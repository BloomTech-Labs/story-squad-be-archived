import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Cohort } from '../../database/entity/Story';
import { Child, Admin } from '../../database/entity/User'
import { Only } from '../../middleware';

const cohortRoutes = Router();

cohortRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { cohort } = req.user as Child;
        res.status(200).json({ cohort });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

cohortRoutes.get('/list', Only(Admin), async (req, res) => {
    try {
        const cohorts = await getRepository(Cohort, connection()).find();
        res.status(200).json({ cohorts });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

cohortRoutes.get('/list/:id', Only(Admin), async (req, res) => {
    try {
        const { id } = req.params;
        const cohort = await getRepository(Cohort, connection()).findOne(id);
        res.status(200).json({ cohort });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

cohortRoutes.post('/list', Only(Admin), async (req, res) => {
    try {
        const cohort = await getRepository(Cohort, connection()).save({
            ...req.updateCohort,
            activity: 'reading',
            week: 1,
            dueDates: {
                reading: new Date(),
                writing: new Date(),
                submission: new Date(),
            },
        });

        res.status(201).json({ cohort });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

cohortRoutes.put('/list/:id', Only(Admin), async (req, res) => {
    try {
        const cohortRepo = getRepository(Cohort, connection());
        const cohortToUpdate = await cohortRepo.findOne(Number(req.params.id));
        if (!cohortToUpdate) throw new Error('404');

        const cohort = { ...cohortToUpdate, ...req.updateCohort };
        const { affected } = await cohortRepo.update(req.params.id, cohort);
        if (!affected) throw new Error();

        res.json({ cohort });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Could Not Update - Cohort not found!' });
                break;
            default:
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
                break;
        }
    }
});

cohortRoutes.delete('/list/:id', Only(Admin), async (req, res) => {
    try {
        const { id } = req.params;
        const { affected } = await getRepository(Cohort, connection()).delete(id);
        if (!affected) throw new Error();
        res.json({ message: `Successfully deleted cohort ${id}` });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

export { cohortRoutes };
