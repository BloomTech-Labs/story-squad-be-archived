import * as express from 'express';

import { createConnection } from 'typeorm';
import { exampleRoutes } from './routes/example.routes';
import { childrenRoutes } from './routes/children/children.routes';

createConnection().then(() => {
    const app = express();
    app.use(exampleRoutes);
    app.use(childrenRoutes);

    app.listen(4000);
    console.log(`Listening on port ${4000}`);
});
