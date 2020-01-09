import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { Middleware } from '../../models/common/Middleware';
import { RegisterDTO, LoginDTO, UpdateChildDTO } from '../../models';

const Validation: Middleware = () => async (req, res, next) => {
    try {
        if (req.path === '/auth/register')
            req.register = (await transformAndValidate(RegisterDTO, req.body)) as RegisterDTO;

        if (req.path === '/auth/login')
            req.login = (await transformAndValidate(LoginDTO, req.body)) as LoginDTO;

        if (
            req.path.includes('/children') &&
            !req.path.includes('/login') &&
            !(req.method === 'GET' || req.method === 'DELETE')
        )
            req.childUpdate = (await transformAndValidate(
                UpdateChildDTO,
                req.body
            )) as UpdateChildDTO;

        next();
    } catch (err) {
        const validationErrors = err as ValidationError[];
        const errors = validationErrors.reduce(
            (errors, { constraints }) => [...errors, ...Object.values(constraints)],
            []
        );

        res.status(400).json({ errors });
    }
};

export { Validation };
