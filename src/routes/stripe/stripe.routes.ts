import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { Parent } from '../../database/entity/Parent';
import { Hash, ValidateHash } from '../../middleware';

const stripeRoutes = Router();



stripeRoutes.use('/charge', ValidateHash());
stripeRoutes.use('/charge', async (req, res) => {
    try {
        const token = sign(req.user, process.env.SECRET_SIGNATURE);
        res.json({ token });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { stripeRoutes };
