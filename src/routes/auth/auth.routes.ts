import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { Parent } from '../../database/entity/Parent';
import { Hash, ValidateHash } from '../../middleware';
import { connection } from '../../util/typeorm-connection';

const authRoutes = Router();

authRoutes.use('/register', Hash());
authRoutes.post('/register', async (req, res) => {
    try {
        if (!req.register.termsOfService)
            throw new Error('401: Accepting Terms of Service is Required');
        const { password, ...user } = await getRepository(Parent, connection()).save(req.register);
        const token = sign(user, process.env.SECRET_SIGNATURE || 'secret');
        res.status(201).json({ token });
    } catch (err) {
        if (err.toString().includes('401')) res.status(401).json(err.toString());
        else res.status(500).json(err.toString());
    }
});

authRoutes.use('/login', ValidateHash());
authRoutes.use('/login', async (req, res) => {
    try {
        const token = sign(req.user, process.env.SECRET_SIGNATURE || 'secret');
        res.json({ token });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { authRoutes };
