import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Canon } from '../../database/entity/Canon';

const canonRoutes = Router();

canonRoutes.get('/:id', async (req, res) => {
    // TODO
    // add token restriction
    try {
        const chapter = await getRepository(Canon, connection()).findOne(req.params.id);
        if (chapter) res.json(chapter);
        else res.status(404).json(`chapter ${req.params.id} not found`);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

canonRoutes.post('/', async (req, res) => {
    // TODO
    // add admin restriction
    try {
        const chapter = await getRepository(Canon, connection()).save(req.canon);
        res.status(201).json(chapter);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { canonRoutes };
