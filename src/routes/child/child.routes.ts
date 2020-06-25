import { Router } from 'express';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { Parent, Child, Stories } from '../../database/entity';
import { Only } from '../../middleware';
import { connection } from '../../util/typeorm-connection';
import { Cohort } from '../../database/entity/Cohort';
import { memory } from 'console';

const childRoutes = Router();

childRoutes.get('/me', Only(Child), async (req, res) => {
    try {
        let { parent, ...me } = req.user as Child;
        // let CohortRepo = getRepository(Cohort, connection());
        // let kidsCohort = await CohortRepo.findOne({ where: { id: me.cohort.id } });

        // const currentWeekIllustration = me.illustrations.filter((element) => {
        //     element.week === kidsCohort.week;
        // });

        // me.illustrations = currentWeekIllustration;

        // const currentWeekStory = me.stories.filter((element) => {
        //     element.week === kidsCohort.week;
        // });

        // me.stories = currentWeekStory;

        res.json({ me });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.get('/preferences', Only(Child), async (req, res) => {
    try {
        const { preferences } = req.user as Child;
        res.json({ preferences });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.get('/cohort', Only(Child), async (req, res) => {
    try {
        const { cohort } = req.user as Child;
        res.json({ cohort });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.get('/progress', Only(Child), async (req, res) => {
    try {
        const { progress } = req.user as Child;
        console.log(progress);
        res.json({ progress });
    } catch (err) {
        console.log(err.toString());
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.post('/progress', Only(Child), async (req, res) => {
    try {
        const child = req.user as Child;
        const { progress } = await getRepository(Child, connection()).save({
            ...child,
            progress: {
                ...child.progress,
                ...req.progressUpdate,
            },
        });
        res.json({ progress });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.get('/parent', Only(Child), async (req, res) => {
    try {
        const {
            parent: { password, ...parent },
        } = req.user as Child;

        res.json({ parent });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.post('/:id/login', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const child = children.find((child) => child.id === Number(req.params.id));
        if (!child) throw new Error('404');

        const token = sign(
            { parentID: req.user.id, childID: child.id, subscription: child.subscription },
            process.env.SECRET_SIGNATURE || 'secret'
        );

        res.json({ token });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Child not found!' });
                break;
            default:
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
                break;
        }
    }
});

// If a parent has multiple children they can see all of their accounts
childRoutes.get('/list', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        children.sort((a, b) => a.id - b.id);
        res.json({ children });
    } catch (err) {
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.post('/list', Only(Parent), async (req, res) => {
    try {
        const cohort = await getRepository(Cohort, connection()).findOne({ order: { id: 'DESC' } });
        if (!cohort) throw new Error('No Cohort');

        const { parent, ...child } = await getRepository(Child, connection()).save({
            ...req.childUpdate,
            cohort,
            parent: req.user,
        });

        res.status(201).json({ child });
    } catch (err) {
        if (err.toString() === 'Error: No Cohort')
            res.status(500).json({
                message: 'Please contact an Admin to setup a Cohort for your Child.',
            });
        res.status(500).json({
            message: 'Hmm... That did not work, please try again later.',
        });
    }
});

childRoutes.get('/list/:id', Only(Parent), async (req, res) => {
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
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
                break;
        }
    }
});

childRoutes.put('/list/:id', Only(Parent), async (req, res) => {
    1;
    try {
        const children = (req.user as Parent).children;
        const childToUpdate = children.find((child) => child.id === Number(req.params.id));
        if (!childToUpdate) throw new Error('404');

        const child = { ...childToUpdate, ...req.childUpdate };
        try {
            const { affected } = await getRepository(Child, connection()).update(
                req.params.id,
                child
            );
        } catch (err) {
            console.log(err.toString());
            res.status(500).json({ err: err.toString(), message: 'Could not update child' });
        }

        res.json({ child });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Could Not Update - Child not found!' });
                break;
            default:
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
                break;
        }
    }
});

childRoutes.delete('/list/:id', Only(Parent), async (req, res) => {
    try {
        const children = (req.user as Parent).children;
        const childToDelete = children.find((child) => child.id === Number(req.params.id));
        if (!childToDelete) throw new Error('404');

        const { affected } = await getRepository(Child, connection()).delete(childToDelete);
        if (!affected) throw new Error();

        res.json({ message: `Successfully deleted ${req.params.id}` });
    } catch (err) {
        switch (err.toString()) {
            case 'Error: 404':
                res.status(404).json({ message: 'Could Not Delete - Child not found!' });
                break;
            default:
                res.status(500).json({
                    message: 'Hmm... That did not work, please try again later.',
                });
                break;
        }
    }
});

export { childRoutes };
