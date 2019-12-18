import { Express, json } from 'express';
import { Validation } from './validate/validate.middleware';

const globalMiddleware = (app: Express) => {
    app.use(json());
    app.use(Validation());
};

export * from './hash/hash.middleware';
export * from './validate/validate.middleware';
export { globalMiddleware };
