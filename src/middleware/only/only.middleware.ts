import { Middleware } from '../../models';
import { Child, Parent } from '../../database/entity';

const Only: Middleware = (limitTo: typeof Parent | typeof Child) => async (req, res, next) => {
    try {
        if (!(req.user instanceof limitTo)) throw new Error();
        next();
    } catch (err) {
        res.status(401).send({ error: 'You are not allowed to do that sorry!' });
    }
};

export { Only };
