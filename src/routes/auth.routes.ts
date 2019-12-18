import { Router } from 'express';
import { getRepository } from 'typeorm';

import { RegisterDTO } from '../models/register.dto';
import { Parent } from '../entity/Parent';

const authRoutes = Router();

authRoutes.post('/register', (req, res) => {
    const user: RegisterDTO = req.body;

    getRepository(Parent).save({ id: 1, name: 'test', isComplete: false });

    res.json({ message: 'Hello' });
});

export { authRoutes };
