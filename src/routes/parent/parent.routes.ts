import { Router } from 'express';

import { Parent } from '../../database/entity';
import { Only } from '../../middleware';

const parentRoutes = Router();

parentRoutes.get('/me', Only(Parent), async (req, res) => {
    try {
        const { password, ...parent } = req.user as Parent;
        res.json({ parent });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

export { parentRoutes };
