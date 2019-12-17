import { Router } from 'express';
import { getRepository } from 'typeorm';

import { Example } from '../entity/Example';

const exampleRoutes = Router();

exampleRoutes.get('/', (req, res) => res.send('Hello World'));
exampleRoutes.post('/', (req, res) => {
    getRepository(Example).save({ id: 1, name: 'test', isComplete: false });
});

export { exampleRoutes };
