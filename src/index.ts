import 'reflect-metadata';
import * as express from 'express';
import * as dotenv from 'dotenv';
import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

import { globalMiddleware } from './middleware';
import { authRoutes } from './routes';

dotenv.config();

//Connect to Heroku DB
const options: ConnectionOptions = process.env.DATABASE_URL
    ? {
          type: 'postgres',
          extra: {
              ssl: true,
          },

          url: process.env.DATABASE_URL,
          synchronize: true,
      }
    : null;

createConnection(options).then(async () => {
    await getConnection().synchronize();

    const app = express();
    globalMiddleware(app);

    app.use('/auth', authRoutes);

    const port = process.env.PORT;
    app.listen(port);
    console.log(`Listening on port ${port}`);
});
