import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { Middleware, JWT } from '../../models';
import { Child, Parent, Admin } from '../../database/entity';
import { connection } from '../../util/typeorm-connection';

const CheckJwt: Middleware = () => async (req, res, next) => {
    try {
        const parentRepo = getRepository(Parent, connection());
        const childRepo = getRepository(Child, connection());
        const adminRepo = getRepository(Admin, connection());

        const { parentID, childID, adminID } = verify(
            req.headers.authorization.replace('Bearer ', ''),
            process.env.SECRET_SIGNATURE || 'secret'
        ) as JWT;

        switch (adminID || childID || parentID || 'fall-through') {
            case adminID:
                req.user = await adminRepo.findOne(adminID);
                break;
            case childID:
                req.user = await childRepo.findOne(childID, {
                    relations: ['parent', 'cohort', 'stories', 'illustrations'],
                });
                break;
            case parentID:
                req.user = await parentRepo.findOne(parentID, {
                    relations: ['children', 'children.cohort'],
                });
                break;
            default:
                req.user = null;
        }

        next();
    } catch (err) {
        res.status(401).send({ message: 'Authentication failed... Please sign in again!' });
    }
};
export { CheckJwt };
