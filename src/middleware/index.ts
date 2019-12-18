import { Express, json } from 'express';
import { Validation } from './validate.middleware';

const globalMiddleware = (app: Express) => {
    app.use(json());
    app.use(Validation());
};

export * from './hash.middleware';
export * from './validate.middleware';
export { globalMiddleware };
