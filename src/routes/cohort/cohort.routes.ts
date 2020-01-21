import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Cohort } from '../../database/entity/Cohort';
import { Only } from '../../middleware';
import { Child } from '../../database/entity';

const cohortRoutes = Router();

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

cohortRoutes.post('/', async (req, res) => {
    try {
        const cohort = await getRepository(Cohort, connection()).save(req.addCohort);
        res.status(201).json({ cohort });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { cohortRoutes };
