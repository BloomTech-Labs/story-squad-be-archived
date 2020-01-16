import { hash, compare } from 'bcryptjs';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as passGen from 'secure-random-password';

import { connection } from '../../util/typeorm-connection';
import { Admin } from '../../database/entity';
import { CheckJwt, Only } from '../../middleware';

const adminRoutes = Router();

adminRoutes.get('/', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { role } = req.user as Admin;
        if (role !== 'admin') throw Error('401');

        const admin = await getRepository(Admin, connection()).find();
        res.json({ admin: admin.map(({ password, ...rest }) => rest) });
    } catch (err) {
        if (err.toString() === 'Error: 401')
            res.status(401).send({ error: 'You are not allowed to do that sorry!' });
        res.status(500).json(err.toString());
    }
});

adminRoutes.get('/:id', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { role } = req.user as Admin;
        if (role !== 'admin') throw Error('401');

        const admin = await getRepository(Admin, connection()).findOne(req.params.id);
        if (!admin) throw new Error('404');
        const { password, ...rest } = admin;
        res.json({ admin: rest });
    } catch (err) {
        if (err.toString() === 'Error: 401')
            res.status(401).send({ error: 'You are not allowed to do that sorry!' });
        if (err.toString() === 'Error: 404')
            res.status(404).json(`admin ${req.params.id} not found`);
        else res.status(500).json(err.toString());
    }
});

adminRoutes.post('/login', async (req, res) => {
    try {
        const { email, password: pass } = req.body as Admin;

        if (email === 'admin' && pass) {
            // create default admin if no admins
            const adminList = await getRepository(Admin, connection()).find({ role: 'admin' });
            if (!adminList.length) {
                const salt: number = parseInt(process.env.SALT || '3', 10);
                const password = await hash(pass, salt);
                const data = await getRepository(Admin, connection()).save({
                    email,
                    password,
                    role: 'admin',
                    validpass: true,
                });
                const token = sign({ adminID: data.id }, process.env.SECRET_SIGNATURE || 'secret');
                res.status(200).json({ token });
                return;
            }
        }
        const data = await getRepository(Admin, connection()).findOne({ email });
        if (!data) throw Error('401');

        if (!(await compare(pass, data.password))) throw Error('401');

        const token = sign({ adminID: data.id }, process.env.SECRET_SIGNATURE || 'secret');
        res.status(200).json({ token });
    } catch (err) {
        if (err.toString().includes('401'))
            res.status(401).json({ error: 'Failed to login, check your username and password...' });
        else res.status(500).json(err.toString());
    }
});

adminRoutes.post('/register', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { role } = req.user as Admin;
        if (role !== 'admin') throw Error('401');

        const user = res.locals.body as Admin;

        const chars = '!#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const pass = passGen.randomPassword({ length: 8, characters: chars });
        const salt: number = parseInt(process.env.SALT || '3', 10);
        const password = await hash(pass, salt);

        const data = await getRepository(Admin, connection()).save({
            ...user,
            password,
            validpass: false,
        });

        res.status(201).json({ admin: { ...data, password: pass } });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

adminRoutes.put('/me', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { password: pass } = req.body;

        const { password: oldPass, ...me } = req.user as Admin;

        const salt: number = parseInt(process.env.SALT || '3', 10);
        const password = await hash(pass, salt);

        const { affected } = await getRepository(Admin, connection()).update(me.id, {
            password,
            validpass: true,
        });
        if (!affected) throw new Error();

        res.json({ me });
    } catch (err) {
        res.status(500).json({ message: err.toString() });
    }
});

// adminRoutes.put('/:id', async (req, res) => {});

// adminRoutes.delete('/:id', async (req, res) => {});

export { adminRoutes };
