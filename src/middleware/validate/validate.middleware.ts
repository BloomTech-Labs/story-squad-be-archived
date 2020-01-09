import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { Middleware } from '../../models/common/Middleware';
import { RegisterDTO } from '../../models/dto/register.dto';
import { LoginDTO } from '../../models/dto/login.dto';
import { Parent } from '../../database/entity/Parent';
import { CanonDTO } from '../../models';

// Declare changes to Request Object
declare global {
    namespace Express {
        interface Request {
            register: RegisterDTO;
            login: LoginDTO;
            canon: CanonDTO;
            user: Omit<Parent, 'password'>;
        }
    }
}

const Validation: Middleware = () => async (req, res, next) => {
    try {
        if (req.path === '/auth/register')
            req.register = (await transformAndValidate(RegisterDTO, req.body)) as RegisterDTO;

        if (req.path === '/auth/login')
            req.login = (await transformAndValidate(LoginDTO, req.body)) as LoginDTO;

        if (req.path === '/canon' && req.method === 'POST')
            req.canon = (await transformAndValidate(CanonDTO, req.body)) as CanonDTO;

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
