import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Canon } from '../../database/entity/Canon';

const canonRoutes = Router();

canonRoutes.get('/:id', async (req, res) => {
    try {
        const cannon = await getRepository(Canon, connection()).findOne(req.params.id);
        if (!cannon) throw new Error('404');
        res.json({ cannon });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json(`chapter ${req.params.id} not found`);
        else res.status(500).json(err.toString());
    }
});

canonRoutes.post('/', async (req, res) => {
    // TODO: Add admin restriction
    try {
        const cannon = await getRepository(Canon, connection()).save(req.addCanon);
        res.status(201).json({ cannon });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { canonRoutes };
