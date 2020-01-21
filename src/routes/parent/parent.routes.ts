import { Router } from 'express';

import { Parent } from '../../database/entity';
import { Only } from '../../middleware';

const parentRoutes = Router();

parentRoutes.get('/me', Only(Parent), async (req, res) => {
    try {
        const { password, ...me } = req.user as Parent;
        res.json({ me });
    } catch (error) {
        res.status(500).json({
            message: 'Sorry, we could not identify you... Try to sign in again.',
        });
    }
});

export { parentRoutes };
