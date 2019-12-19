import * as express from 'express';

import { createConnection } from 'typeorm';
import { exampleRoutes } from './routes/example.routes';
import { cannonRoutes } from './routes/cannon/cannon.routes';

createConnection().then(() => {
    const app = express();
    app.use(express.json());
    app.use(exampleRoutes);
    app.use('/cannon', cannonRoutes);

    app.listen(4000);
    console.log(`Listening on port ${4000}`);
});
