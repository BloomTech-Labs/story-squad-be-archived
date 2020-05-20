import { hash, compare } from 'bcryptjs';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

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
            res.status(401).send({ message: 'You are not allowed to do that sorry!' });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

adminRoutes.get('/me', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { password, ...me } = req.user as Admin;
        res.json({ me });
    } catch (err) {
        res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
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
        switch (err.toString()) {
            case 'Error: 401':
                res.status(401).send({ message: 'You are not allowed to do that sorry!' });
                break;
            case 'Error: 404':
                res.status(404).json({ message: `admin ${req.params.id} not found` });
                break;
            default:
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
        }
    }
});

adminRoutes.post('/', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { role } = req.user as Admin;
        //const { role } = req.body as Admin;
        if (role !== 'admin') throw Error('401');

        const user = res.locals.body as Admin;

        const { id } = await getRepository(Admin, connection()).save({
            ...user,
            password: 'null',
        });

        const { affected } = await getRepository(Admin, connection()).update(id, {
            temptoken: sign({ adminID: id }, process.env.SECRET_SIGNATURE || 'secret', {
                expiresIn: '1d',
            }),
        });
        if (!affected) throw Error();

        // To Do: add email client (Twilio?) to email register link + temptoken directly

        res.status(201).json({ id });
    } catch (err) {
        if (err.toString() === 'Error: 401')
            res.status(401).send({ message: 'You are not allowed to do that sorry!' });
        else {
            res.status(500).json({ message: 'Hmm... That did not work, please try again later.' })
        };
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
            res.status(401).json({
                message: 'Failed to login, check your username and password...',
            });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

adminRoutes.put('/register', CheckJwt(), Only(Admin), async (req, res) => {
    try {
        const { id, temptoken } = req.user as Admin;

        if (!temptoken || temptoken != req.headers.authorization.replace('Bearer ', ''))
            throw Error('401');

        const { password: pass } = res.locals.body as Admin;
        const salt: number = parseInt(process.env.SALT || '3', 10);
        const password = await hash(pass, salt);
        console.log(password);

        const { affected } = await getRepository(Admin, connection()).update(id, {
            password,
            temptoken: null,
        });
        if (!affected) throw Error();

        const token = sign({ adminID: id }, process.env.SECRET_SIGNATURE || 'secret');
        res.status(200).json({ token });
    } catch (err) {
        if (err.toString() === 'Error: 401')
            res.status(401).send({ message: 'You are not allowed to do that sorry!' });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

export { adminRoutes };
