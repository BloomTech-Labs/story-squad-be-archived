import { Express, json } from 'express';
import * as cors from 'cors';

import { Parent, Child, Admin } from '../database/entity';
import {
    RegisterDTO,
    LoginDTO,
    UpdateChildDTO,
    AddCardDTO,
    AddCanonDTO,
    SubscribeDTO,
    AddCohortDTO,
} from '../models';
import { Validation } from './validate/validate.middleware';

declare global {
    namespace Express {
        interface Request {
            /**
             * @description The current JWT verified user.
             * BE SURE TO REMOVE THE PASSWORD WHEN RETURNING!!
             * @type {(Parent | Child | Admin)}
             * @memberof Request
             */
            user?: Parent | Child | Admin;

            register?: RegisterDTO;
            login?: LoginDTO;
            childUpdate?: UpdateChildDTO;

            addCard?: AddCardDTO;

            addCanon?: AddCanonDTO;

            addCohort?: AddCohortDTO;

            subscribe?: SubscribeDTO;
        }
    }
}

const globalMiddleware = (app: Express) => {
    app.use(json({ limit: '10mb' }));
    app.use(cors({ origin: '*' }));
    app.use(Validation());
};

export * from './hash/hash.middleware';
export * from './jwt/jwt.middleware';
export * from './only/only.middleware';
export * from './stripe/stripe.middleware';
export * from './validate/validate.middleware';
export { globalMiddleware };
