import 'reflect-metadata';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { globalMiddleware } from './middleware';
import { authRoutes, childRoutes, parentRoutes } from './routes';
import { connection } from './util/typeorm-connection';
import { CheckJwt } from './middleware/jwt/jwt.middleware';

dotenv.config();

createConnection(connection()).then(async () => {
    const app = express();

    globalMiddleware(app);

    app.use('/auth', authRoutes);
    app.use('/child', CheckJwt(), childRoutes);
    app.use('/parent', CheckJwt(), parentRoutes);

    const port = process.env.PORT || 4000;
    app.listen(port);
    console.log(`Listening on port ${port}`);
});
