import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Canon } from '../../database/entity/Canon';

const canonRoutes = Router();

canonRoutes.get('/:id', async (req, res) => {
    try {
        const chapter = await getRepository(Canon, connection()).findOne(req.params.id);
        if (chapter) res.json(chapter);
        else res.status(404).json(`chapter ${req.params.id} not found`);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

interface pdf {
    base64: string;
    week: number;
}

canonRoutes.post('/', async (req, res) => {
    // TODO
    // add admin restriction
    try {
        const pdf: pdf = req.body;
        const chapter = await getRepository(Canon, connection()).save(pdf);
        res.json(chapter);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { canonRoutes };
