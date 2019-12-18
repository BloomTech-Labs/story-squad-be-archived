import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { Middleware } from '../../models/common/Middleware';
import { RegisterDTO } from '../../models/dto/register.dto';
import { LoginDTO } from '../../models/dto/login.dto';

const Validation: Middleware = () => async (req, res, next) => {
    try {
        if (req.path === '/auth/register')
            req.register = (await transformAndValidate(RegisterDTO, req.body)) as RegisterDTO;

        if (req.path === '/auth/login')
            req.login = (await transformAndValidate(LoginDTO, req.body)) as LoginDTO;

        next();
    } catch (err) {
        const validationErrors = err as ValidationError[];
        const errors = validationErrors.reduce((errors, { constraints }) => {
            return [...errors, ...Object.values(constraints)];
        }, []);

        res.status(400).json({ errors });
    }
};

export { Validation };
