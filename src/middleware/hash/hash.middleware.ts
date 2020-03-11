import { hash, compare } from 'bcryptjs';
import { getRepository } from 'typeorm';

import { Middleware } from '../../models/common/Middleware';
import { Parent } from '../../database/entity/Parent';
import { connection } from '../../util/typeorm-connection';

const Hash: Middleware = () => async (req, res, next) => {
    try {
        if (!req.register) throw new Error('No register object on body...');
        const salt: number = parseInt(process.env.SALT || '3', 10);

        req.register = {
            ...req.register,
            password: await hash(req.register.password, salt),
        };

        next();
    } catch (err) {
        res.status(400).send({
            message: 'Failed to register, please check your email and password and try again.',
        });
    }
};

const ValidateHash: Middleware = () => async (req, res, next) => {
    try {
        if (!req.login) throw new Error('No login object on body...');

        const { email: username } = req.login;
        const [user] = await getRepository(Parent, connection()).find({
            email: username,
        });
        if (!(await compare(req.login.password, user.password))) throw new Error();
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ message: 'Failed to login, check your username and password...' });
    }
};

export { Hash, ValidateHash };
