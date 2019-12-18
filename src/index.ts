import * as express from 'express';

import { createConnection } from 'typeorm';
import { authRoutes } from './routes/auth.routes';

createConnection().then(() => {
    const app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);

    app.listen(4000);
    console.log(`Listening on port ${4000}`);
});
