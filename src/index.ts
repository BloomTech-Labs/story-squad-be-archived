import 'reflect-metadata';
const path = require('path');
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
    //moderatorRoutes,
    storyRoutes,
    illustrationRoutes,
    cohortRoutes,
    matchMakingRoutes,
    battlesRoutes,
    versusRoutes,
    votingRoutes,
    finalRoutes,
} from './routes';
import { connection } from './util/typeorm-connection';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { point_allocation_timer } from './timers/pointalloc.timers';
import { vote_allocation_timer } from './timers/voting.timers';
import { results_timer } from './timers/results.timers';

dotenv.config();

const main = async () => {
    // required because module.exports is an array
    const ormconfig = (await import('./ormconfig')) as PostgresConnectionOptions[];

    const config = ormconfig.find((config) => config.name === connection());
    createConnection(config).then(async () => {
        const app = express();

        globalMiddleware(app);
        app.use(express.static(path.join(__dirname, '../', 'public')));
        app;
        app.use('/admin', adminRoutes);
        //app.use('/moderator', moderatorRoutes);
        app.use('/auth', authRoutes);
        app.use('/canon', CheckJwt(), canonRoutes);
        app.use('/cohort', CheckJwt(), cohortRoutes);
        app.use('/children', CheckJwt(), childRoutes);
        app.use('/parents', CheckJwt(), parentRoutes);
        app.use('/payment', CheckJwt(), UpdateStripeRecords(), stripeRoutes);
        app.use('/matchmaking', CheckJwt(), matchMakingRoutes);
        app.use('/battlesRoutes', CheckJwt(), battlesRoutes);
        app.use('/versusRoutes', CheckJwt(), versusRoutes);
        app.use('/storyRoutes', CheckJwt(), storyRoutes);
        app.use('/illustrationRoutes', CheckJwt(), illustrationRoutes);
        app.use('/votingRoutes', CheckJwt(), votingRoutes);
        app.use('/finalRoutes', CheckJwt(), finalRoutes);

        point_allocation_timer();
        vote_allocation_timer();
        results_timer();

        const port = process.env.PORT || 4000;
        app.listen(port);
        console.log(`Listening on port ${port}`);
    });
};

main();
