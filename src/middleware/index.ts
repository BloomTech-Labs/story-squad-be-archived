import { Express, json } from 'express';
import * as cors from 'cors';

import { Validation } from './validate/validate.middleware';

const globalMiddleware = (app: Express) => {
    app.use(json());
    app.use(cors({ origin: '*' }));
    app.use(Validation());
};

export * from './hash/hash.middleware';
export * from './validate/validate.middleware';
export { globalMiddleware };
