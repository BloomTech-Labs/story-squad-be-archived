import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { Middleware, RegisterDTO, LoginDTO, UpdateChildDTO, CardDTO } from '../../models';

const Validation: Middleware = () => async (req, res, next) => {
    try {
        //Validates and transforms register request objects prior to routing
        if (req.path === '/auth/register')
            req.register = (await transformAndValidate(RegisterDTO, req.body)) as RegisterDTO;

        //Validates and transforms login request objects prior to routing
        if (req.path === '/auth/login')
            req.login = (await transformAndValidate(LoginDTO, req.body)) as LoginDTO;

        if (req.path.includes('/payment') && req.body.card)
            req.card = (await transformAndValidate(CardDTO, req.body.card)) as CardDTO;

        //Validates and transforms childUpdate request objects prior to routing
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
        //Asserts any errors will be ValidationErrors
        const validationErrors = err as ValidationError[];

        //Simplifies Errors into smaller objects prior to sending to the client
        const errors = validationErrors.reduce(
            (errors, { constraints }) => [...errors, ...Object.values(constraints)],
            []
        );

        res.status(400).json({ errors });
    }
};

export { Validation };
