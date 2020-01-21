import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Cohort } from '../../database/entity/Cohort';
import { Only } from '../../middleware';
import { Child, Parent } from '../../database/entity';

const cohortRoutes = Router();

//GET COHORT

cohortRoutes.get('/', Only(Child), async (req, res) => {
    try {
        const { cohort } = req.user as Child;
        res.status(200).json({ cohort });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json(`cohort ${req.params.id} not found`);
        else res.status(500).json(err.toString());
    }
});

//ADD COHORT

cohortRoutes.post('/', async (req, res) => {
    try {
        const cohort = await getRepository(Cohort, connection()).save(req.addCohort);
        res.status(201).json({ cohort });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

//DELETE COHORT

cohortRoutes.delete('/:id', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const cohortToDelete = children.find((cohort) => cohort.id === Number(req.params.id));
        if (!cohortToDelete) throw new Error('404');

        const { affected } = await getRepository(Child, connection()).delete(cohortToDelete);
        if (!affected) throw new Error();

        res.json({ message: `Successfully deleted ${req.params.id}` });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Could Not Delete - Cohort not found!' });
                break;
            default:
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
                break;
        }
    }
});

//UPDATE COHORT ACTIVITY

cohortRoutes.put('/:id', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const cohortToUpdate = children.find((cohort) => cohort.id === Number(req.params.id));
        if (!cohortToUpdate) throw new Error('404');

        const cohort = { ...cohortToUpdate };
        const { affected } = await getRepository(Cohort, connection()).update(
            req.params.id,
            cohort
        );
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

export { cohortRoutes };
