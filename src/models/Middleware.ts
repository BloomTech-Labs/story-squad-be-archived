import * as express from 'express';

export type Middleware<T = {}> = (
    options?: T
) => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
