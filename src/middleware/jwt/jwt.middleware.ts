import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { Middleware, JWT } from '../../models';
import { Child, Parent } from '../../database/entity';
import { connection } from '../../util/typeorm-connection';

const CheckJwt: Middleware = () => async (req, res, next) => {
    try {
        const parentRepo = getRepository(Parent, connection());
        const childRepo = getRepository(Child, connection());

        const { parentID, childID } = verify(
            req.headers.authorization.replace('Bearer ', ''),
            process.env.SECRET_SIGNATURE || 'secret'
        ) as JWT;

        req.user = childID
            ? await childRepo.findOne(childID, {
                  relations: ['parent'],
              })
            : await parentRepo.findOne(parentID, {
                  relations: ['children'],
              });

        next();
    } catch (err) {
        res.status(401).send({ message: 'Authentication failed... Please sign in again!' });
    }
};
export { CheckJwt };
