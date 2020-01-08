import { Router } from 'express';
import { getRepository } from 'typeorm';

import { Parent } from '../../database/entity';
import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';

const parentRoutes = Router();

parentRoutes.get('/me', Only(Parent), async (req, res) => {
    try {
        const { password, ...parent } = req.user as Parent;
        res.json(parent);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

export { parentRoutes };
