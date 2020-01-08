import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { Parent, Child } from '../../database/entity';
import { Only } from '../../middleware';
import { connection } from '../../util/typeorm-connection';

import * as moment from 'moment';

const childRoutes = Router();

childRoutes.get('/me', Only(Child), async (req, res) => {
    try {
        const { parent, ...child } = req.user as Child;
        res.json({ child });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

childRoutes.post('/:id/login', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const child = children.find((child) => child.id === Number(req.params.id));
        if (!child) throw new Error('404');

        const token = sign(
            { parentID: req.user.id, childID: child.id },
            process.env.SECRET_SIGNATURE || 'secret'
        );

        res.json({ token });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Child not found!' });
                break;
            default:
                res.status(500).json({ message: err.toString() });
                break;
        }
    }
});

childRoutes.get('/', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        res.json({ children });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

childRoutes.post('/', Only(Parent), async (req, res) => {
    try {
        //Set week to next week upon creation
        const week = Number(moment().format('W')) + 1;

        const { parent, ...child } = await getRepository(Child, connection()).save({
            ...req.childUpdate,
            week,
            parent: req.user,
        });

        res.status(201).json({ child });
    } catch (err) {
        res.status(500).json(err.toString());
    }
});

childRoutes.get('/:id', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const child = children.find((child) => child.id === Number(req.params.id));

        if (!child) throw new Error('404');
        res.json({ child });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Child not found!' });
                break;
            default:
                res.status(500).json({ message: err.toString() });
                break;
        }
    }
});

childRoutes.put('/:id', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const childToUpdate = children.find((child) => child.id === Number(req.params.id));
        if (!childToUpdate) throw new Error('404');

        const child = { ...childToUpdate, ...req.childUpdate };
        const { affected } = await getRepository(Child, connection()).update(req.params.id, child);
        if (!affected) throw new Error();

        res.json({ child });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Could Not Update - Child not found!' });
                break;
            default:
                res.status(500).json({ message: err.toString() });
                break;
        }
    }
});

childRoutes.delete('/:id', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const childToDelete = children.find((child) => child.id === Number(req.params.id));
        if (!childToDelete) throw new Error('404');

        const { affected } = await getRepository(Child, connection()).delete(childToDelete);
        if (!affected) throw new Error();

        res.sendStatus(204);
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Could Not Delete - Child not found!' });
                break;
            default:
                res.status(500).json({ message: err.toString() });
                break;
        }
    }
});

export { childRoutes };
