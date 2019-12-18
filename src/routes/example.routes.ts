import { Router } from 'express';
import { getRepository } from 'typeorm';

import { Example } from '../entity/Example';

const exampleRoutes = Router();

exampleRoutes.get('/', async (req, res) => {
    const resp = await getRepository(Example).find();
    res.json(resp);
});
exampleRoutes.post('/', async (req, res) => {
    const resp = await getRepository(Example).save({ name: 'test', isComplete: false });
    res.status(201).json(resp);
});

export { exampleRoutes };
