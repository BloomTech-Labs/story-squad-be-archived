import { hash, compare } from 'bcrypt';
import { getRepository } from 'typeorm';

import { Middleware } from '../../models/common/Middleware';
import { Parent } from '../../database/entity/Parent';

const Hash: Middleware = () => async (req, res, next) => {
    try {
        if (!req.register) throw new Error('No register object on body...');
        const salt: number = parseInt(process.env.SALT, 10);

        req.register = {
            ...req.register,
            password: await hash(req.register.password, salt),
        };

        next();
    } catch (err) {
        res.status(401).send({ error: err.toString() });
    }
};

const ValidateHash: Middleware = () => async (req, res, next) => {
    try {
        if (!req.login) throw new Error('No login object on body...');

        const { username } = req.login;
        const [{ password, ...user }] = await getRepository(Parent).find({ username });
        await compare(req.login.password, password);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(403).send({ error: 'Failed to login, check your username and password...' });
    }
};

export { Hash, ValidateHash };
