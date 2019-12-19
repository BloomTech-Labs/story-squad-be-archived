import { Router } from 'express';
import { getRepository } from 'typeorm';
// import { sign } from 'jsonwebtoken';

import { Cannon } from '../../database/entity/Cannon';
// import { Hash, ValidateHash } from '../../middleware';

const cannonRoutes = Router();

cannonRoutes.get('/', async (req, res) => {
    // TODO
    // get child id from token
    // look up week #
    // return current chapter id
});

cannonRoutes.get('/:id', async (req, res) => {
    try {
        const chapter = await getRepository(Cannon).findOne(req.params.id);
        if (chapter) res.json(chapter);
        else res.status(404).json(`chapter ${req.params.id} not found`);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

interface pdf {
    base64: string;
}

cannonRoutes.post('/', async (req, res) => {
    // TODO
    // add admin restriction
    try {
        const pdf: pdf = { base64: req.body.base64 };
        const chapter = await getRepository(Cannon).save(pdf);
        res.json(chapter);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { cannonRoutes };
