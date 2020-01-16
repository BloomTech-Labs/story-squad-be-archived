import { hash, compare } from 'bcryptjs';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as passGen from 'secure-random-password';

import { connection } from '../../util/typeorm-connection';
import { Admin } from '../../database/entity';

const adminRoutes = Router();

adminRoutes.get('/', async (req, res) => {
    try {
        const admin = await getRepository(Admin, connection()).find();
        res.json({ admin: admin.map(({ password, ...rest }) => rest) });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

adminRoutes.get('/:id', async (req, res) => {
    try {
        const admin = await getRepository(Admin, connection()).findOne(req.params.id);
        if (!admin) throw new Error('404');
        const { password, ...rest } = admin;
        res.json({ admin: rest });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json(`admin ${req.params.id} not found`);
        else res.status(500).json(err.toString());
    }
});

adminRoutes.post('/login', async (req, res) => {
    try {
        const user: { email: string; password: string } = req.body;

        if (user.email === 'admin' && user.password) {
            // create default admin if no admins
            const adminList = await getRepository(Admin, connection()).find({ super: true });
            if (!adminList.length) {
                const salt: number = parseInt(process.env.SALT || '3', 10);
                const password = await hash(user.password, salt);
                const data = await getRepository(Admin, connection()).save({
                    ...user,
                    password,
                    super: true,
                    validpass: true,
                });
                const token = sign({ adminID: data.id }, process.env.SECRET_SIGNATURE || 'secret');
                res.status(200).json({ token });
            }
        } else {
            const data = await getRepository(Admin, connection()).findOne({ email: user.email });
            if (!data) throw Error('401');

            if (!(await compare(user.password, data.password))) throw Error('401');

            const token = sign({ adminID: data.id }, process.env.SECRET_SIGNATURE || 'secret');
            res.status(200).json({ token });
        }
    } catch (err) {
        if (err.toString().includes('401'))
            res.status(401).json({ error: 'Failed to login, check your username and password...' });
        else res.status(500).json(err.toString());
    }
});

adminRoutes.post('/register', async (req, res) => {
    try {
        const user: { email: string; admin: boolean } = req.body;

        const chars = '!#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const pass = passGen.randomPassword({ length: 16, characters: chars });
        const salt: number = parseInt(process.env.SALT || '3', 10);
        const password = await hash(pass, salt);

        const data = await getRepository(Admin, connection()).save({
            email: user.email,
            password,
            validpass: false,
            super: user.admin,
        });

        res.status(201).json({ admin: { ...data, password: pass } });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

adminRoutes.put('/:id', async (req, res) => {});

adminRoutes.delete('/:id', async (req, res) => {});

export { adminRoutes };
