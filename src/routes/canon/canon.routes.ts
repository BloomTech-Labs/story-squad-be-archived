import { Router } from 'express';
import { getRepository } from 'typeorm';

import { connection } from '../../util/typeorm-connection';
import { Only } from '../../middleware';
import { Admin, Canon } from '../../database/entity';

const canonRoutes = Router();

canonRoutes.get('/', Only(Admin), async (req, res) => {
    try {
        const { role } = req.user as Admin;
        if (role !== 'admin') throw Error('401');

        const canon = await getRepository(Canon, connection()).find();
        res.json({ canon });
    } catch (err) {
        if (err.toString() === 'Error: 401')
            res.status(401).send({ message: 'You are not allowed to do that sorry!' });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

canonRoutes.get('/:id', async (req, res) => {
    // To Do: add restriction on child accessing future week's prompts
    // To Do: disallow parent access
    try {
        const canon = await getRepository(Canon, connection()).findOne(req.params.id);
        if (!canon) throw new Error('404');
        res.json({ canon });
    } catch (err) {
        if (err.toString() === 'Error: 404')
            res.status(404).json({ message: `Chapter ${req.params.id} not found` });
        else
            res.status(500).json({
                message: 'Hmm... That did not work, please try again later.',
            });
    }
});

canonRoutes.post('/', Only(Admin), async (req, res) => {
    try {
        const { role } = req.user as Admin;
        if (role !== 'admin') throw Error('401');

        const canon = await getRepository(Canon, connection()).save(req.addCanon);
        res.status(201).json({ canon });
    } catch (err) {
        if (err.toString() === 'Error: 401')
            res.status(401).send({ message: 'You are not allowed to do that sorry!' });
        else res.status(500).json({ message: 'Hmm... That did not work, please try again later.' });
    }
});

export { canonRoutes };
