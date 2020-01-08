import { Router } from 'express';
import { getRepository } from 'typeorm';
import { verify } from 'jsonwebtoken';

import { Parent } from '../../database/entity/Parent';
import { Child } from '../../database/entity/Child';
import { connection } from '../../util/typeorm-connection';

const parentsRoutes = Router();

parentsRoutes.get('/', async (req, res) => {
    try {
        // TODO: restrict to logged in parent
        const parents = await getRepository(Parent).find();
        res.json(parents);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

parentsRoutes.post('/addchild', async (req, res) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(400).json({ message: 'Missing authorization header' });
    }

    try {
        const token = req.headers.authorization;
        verify(token, process.env.SECRET_SIGNATURE || 'secret', async (err: any, parent: any) => {
            if (err) {
                res.status(401).json({ message: 'Invalid Credentials' });
            } else {
                const child = { ...req.child, week: 1, parent: parent.id };
                const resp = await getRepository(Child).save(child);
                res.status(201).json(resp);
            }
        });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

parentsRoutes.get('/children', async (req, res) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(400).json({ message: 'Missing authorization header' });
    }

    try {
        const token = req.headers.authorization;
        verify(token, process.env.SECRET_SIGNATURE || 'secret', async (err: any, parent: any) => {
            if (err) {
                res.status(401).json({ message: 'Invalid Credentials' });
            } else {
                const children = await getRepository(Child).find({ parent: parent.id });
                res.json(children);
            }
        });
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

export { parentsRoutes };
