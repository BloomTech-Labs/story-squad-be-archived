import * as express from 'express';

// Defines type for Express Middleware.
// Used like SomeMiddleware({someOption: true}) eg. express.json()
// Returns a function with the shape of (req, res, next) => void
export type Middleware<T = {}> = (
    options?: T
) => (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => void | Promise<void>;
