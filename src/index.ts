import * as express from 'express';

import { exampleRoutes } from './routes/example.routes';

const app = express();
app.use(exampleRoutes);

app.listen(4000);
