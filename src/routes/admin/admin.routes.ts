import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Admin } from '../../database/entity';

const adminRoutes = Router();

adminRoutes.get('/', async (req, res) => {
    try {
        const admin = await getRepository(Admin, connection()).find();
        res.json({ admin: admin.map(({ password, ...rest }) => rest) });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

adminRoutes.get('/:id', async (req, res) => {
    try {
        const admin = await getRepository(Admin, connection()).findOne(req.params.id);
        if (!admin) throw new Error('404');
        const { password, ...rest } = admin;
        res.json({ admin: rest });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json(`admin ${req.params.id} not found`);
        else res.status(500).json(err.toString());
    }
});

adminRoutes.post('/', async (req, res) => {});

adminRoutes.put('/', async (req, res) => {});

adminRoutes.delete('/:id', async (req, res) => {});

export { adminRoutes };
