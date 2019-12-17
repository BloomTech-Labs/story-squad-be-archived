import * as express from 'express';

import { createConnection } from 'typeorm';
import { exampleRoutes } from './routes/example.routes';

createConnection().then(() => {
    const app = express();
    app.use(exampleRoutes);

    app.listen(4000);
    console.log(`Listening on port ${4000}`);
});
