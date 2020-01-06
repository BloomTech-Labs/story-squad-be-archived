import { sign, verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { Middleware } from '../../models';
import { Parent } from '../../database/entity/Parent';

const ValidateHash: Middleware = () => async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw new Error('Authentication on header not detected...');
        const id = verify(token, process.env.SECRET_SIGNATURE);
        const [{ password, ...user }] = await getRepository(Parent).find({ username });
        
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send({ error: err.toString() });
    }
};
