import 'reflect-metadata';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { globalMiddleware } from './middleware';
import { authRoutes } from './routes';

dotenv.config();

createConnection().then(() => {
    const app = express();
    globalMiddleware(app);

    app.use('/auth', authRoutes);

    app.listen(4000);
    console.log(`Listening on port ${4000}`);
});
