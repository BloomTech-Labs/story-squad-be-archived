import { Router } from 'express';
import { getRepository } from 'typeorm';

import { Parent } from '../../database/entity/Parent';
import { Child } from '../../database/entity/Child';
import { connection } from '../../util/typeorm-connection';

const parentsRoutes = Router();

parentsRoutes.get('/', async (req, res) => {
    try {
        // TODO: restrict to logged in parent
        const parents = await getRepository(Parent).find();
        res.json(parents);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

parentsRoutes.post('/addchild', async (req, res) => {
    try {
        // TODO: restrict to parent
        const child = req.child;
        const resp = await getRepository(Child).save(child);
        res.status(201).json(resp);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { parentsRoutes };
