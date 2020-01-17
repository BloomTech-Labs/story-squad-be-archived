import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Cohort } from '../../database/entity/Cohort';

const cohortRoutes = Router();

cohortRoutes.get('/', async (req, res) => {
    try {
        const cohort = await getRepository(Cohort, connection()).findOne(req.params.id);
        if (!cohort) throw new Error('404');
        res.json({ cohort });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json(`chapter ${req.params.id} not found`);
        else res.status(500).json(err.toString());
    }
});

// cohortRoutes.post('/', async (req, res) => {
//     try {
//         const cohort = await getRepository(Cohort, connection()).save(req.addCohort);
//         res.status(201).json({ cohort });
//     } catch (err) {
//         res.status(500).json(err.toString());
//     }
// });

export { cohortRoutes };
