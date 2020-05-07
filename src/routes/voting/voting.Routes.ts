import { Router } from 'express';
import { Only } from '../../middleware';
import { Child } from '../../database/entity';

const votingRoutes = Router();

votingRoutes.get('/voting', Only(Child), async (req, res) => {
    res.status(200).send('test');
});

export { votingRoutes };
