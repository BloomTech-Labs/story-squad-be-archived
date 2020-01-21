import 'reflect-metadata';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { globalMiddleware, CheckJwt, UpdateStripeRecords } from './middleware';
import {
    authRoutes,
    childRoutes,
    parentRoutes,
    stripeRoutes,
    canonRoutes,
    adminRoutes,
    submissionRoutes,
} from './routes';
import { connection } from './util/typeorm-connection';

dotenv.config();

createConnection(connection()).then(async () => {
    const app = express();

    globalMiddleware(app);

    app.use('/admin', adminRoutes);
    app.use('/auth', authRoutes);
    app.use('/canon', CheckJwt(), canonRoutes);
    app.use('/children/submissions', CheckJwt(), submissionRoutes);
    app.use('/children', CheckJwt(), childRoutes);
    app.use('/parents', CheckJwt(), parentRoutes);
    app.use('/payment', CheckJwt(), UpdateStripeRecords(), stripeRoutes);

    const port = process.env.PORT || 4000;
    app.listen(port);
    console.log(`Listening on port ${port}`);
});
