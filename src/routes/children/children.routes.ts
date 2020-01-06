import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Children } from '../../database/entity/Children';

const childrenRoutes = Router();

childrenRoutes.get('/', async (req, res) => {
    try {
        const children = await getRepository(Children).find();

        res.json(children);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});
