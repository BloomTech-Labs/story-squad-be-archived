import { Router } from 'express';

const exampleRoutes = Router();

exampleRoutes.get('/', () => 'Hello World');

export { exampleRoutes };
