import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { Middleware, JWT } from '../../models';
import { Parent } from '../../database/entity/Parent';
import { connection } from '../../util/typeorm-connection';

const CheckJwt: Middleware = () => async (req, res, next) => {
    try {
        const { id } = verify(
            req.headers.authorization.replace('Bearer ', ''),
            process.env.SECRET_SIGNATURE || 'secret'
        ) as JWT;
        const { password, ...user } = await getRepository(Parent, connection()).findOne(id);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Authentication failed... Please sign in again!' });
    }
};
export { CheckJwt };
