import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import {
    Middleware,
    RegisterDTO,
    LoginDTO,
    UpdateChildDTO,
    AddCardDTO,
    AddCanonDTO,
    AdminRegisterDTO,
    SubscribeDTO,
    UpdateCohortDTO,
    UpdateProgressDTO,
} from '../../models';

const Validation: Middleware = () => async (req, res, next) => {
    try {
        if (req.method !== 'POST' && req.method !== 'PUT') return next();

        //Validates and transforms register request objects prior to routing
        if (req.path === '/auth/register')
            req.register = (await transformAndValidate(RegisterDTO, req.body)) as RegisterDTO;

        //Validates and transforms login request objects prior to routing
        if (req.path === '/auth/login')
            req.login = (await transformAndValidate(LoginDTO, req.body)) as LoginDTO;

        //Validates and transforms admin register request objects prior to routing
        if (req.path === '/admin/register')
            res.locals.body = (await transformAndValidate(
                AdminRegisterDTO,
                req.body
            )) as AdminRegisterDTO;

        //Validates and transforms card request objects prior to routing
        if (req.path === '/payment/cards')
            req.addCard = (await transformAndValidate(AddCardDTO, req.body)) as AddCardDTO;

        if (req.path === '/payment/subscribe')
            req.subscribe = (await transformAndValidate(SubscribeDTO, req.body)) as SubscribeDTO;

        //Validates and transforms canon request objects prior to routing
        if (req.path === '/canon')
            req.addCanon = (await transformAndValidate(AddCanonDTO, req.body)) as AddCanonDTO;

        //Validates and transforms cohort request objects prior to routing
        if (req.path === '/cohort/list' && req.method === 'POST')
            req.updateCohort = (await transformAndValidate(
                UpdateCohortDTO,
                req.body
            )) as UpdateCohortDTO;

        //Validates and transforms childUpdate request objects prior to routing
        if (req.path.match(/\/children\/list(\/\d*)?/))
            req.childUpdate = (await transformAndValidate(
                UpdateChildDTO,
                req.body
            )) as UpdateChildDTO;

        //Validates and transforms progressUpdate request objects prior to routing
        if (req.path === '/children/progress')
            req.progressUpdate = (await transformAndValidate(
                UpdateProgressDTO,
                req.body
            )) as UpdateProgressDTO;

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
