import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { CardDTO, LoginDTO, RegisterDTO, Middleware } from '../../models';
import { Parent } from '../../database/entity/Parent';

// Declare changes to Request Object
declare global {
    namespace Express {
        interface Request {
            register: RegisterDTO;
            login: LoginDTO;
            card: CardDTO;
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

        if (req.path === '/payment' && req.body.card)
            req.card = (await transformAndValidate(CardDTO, req.body.card)) as CardDTO;

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
