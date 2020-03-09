import { Router } from 'express';
import { getRepository } from 'typeorm';

import { Only } from '../../middleware';
import { Admin, Canon, Child } from '../../database/entity';
import { connection } from '../../util/typeorm-connection';

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
        const cannonIndex = await getRepository(Canon, connection()).findOne(req.params.id);
        if (!cannonIndex) throw new Error('404');

        const { altbase64, base64 } = cannonIndex;
        if (req.user instanceof Child) {
            res.json({
                canon: req.user?.preferences.dyslexia
                    ? { base64: altbase64 || base64 }
                    : { base64 },
            });
        } else {
            res.json({ canon: cannonIndex });
        }
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
