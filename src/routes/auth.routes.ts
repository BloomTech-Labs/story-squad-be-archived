import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { Parent } from '../entity/Parent';
import { Hash, ValidateHash } from '../middleware';

const authRoutes = Router();

authRoutes.use('/register', Hash());
authRoutes.post('/register', async (req, res) => {
    try {
        const { password, ...user } = await getRepository(Parent).save(req.register);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

authRoutes.use('/login', ValidateHash());
authRoutes.use('/login', async (req, res) => {
    try {
        const token = sign(req.user, process.env.SECRET_SIGNATURE);
        res.json({ token });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

export { authRoutes };
