import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Children } from '../../database/entity/Children';

const childrenRoutes = Router();

childrenRoutes.get('/', async (req, res) => {
    try {
        // TODO: restrict to parent
        const children = await getRepository(Children).find();

        res.json(children);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

childrenRoutes.post('/', async (req, res) => {
    try {
        // TODO: restrict to parent
        const [username, week, grade]: [String, Number, Number] = req.body;
        const resp = await getRepository(Children).save({ username, week, grade });
        res.status(201).json(resp);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

// by id or JWT?
childrenRoutes.get('/id', async (req, res) => {
    try {
        // TODO: restrict to parent
        const child = await getRepository(Children).findOne(req.params.id);
        if (child) res.json(child);
        else res.status(404).json(`child ${req.params.id} not found`);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

childrenRoutes.put('/id', async (req, res) => {
    try {
        // TODO: restrict to parent
        // May need to convert req.params.id to a number?
        const [username, week, grade]: [String, Number, Number] = req.body;
        const child = await getRepository(Children).update(req.params.id, {
            username,
            week,
            grade,
        });
        if (child) res.json(child);
        else res.status(404).json(`child ${req.params.id} not found`);
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

childrenRoutes.delete('/id', async (req, res) => {
    try {
        // TODO: restrict to parent
        const child = await getRepository(Children).delete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});
