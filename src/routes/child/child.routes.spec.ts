import * as request from 'supertest';
import * as express from 'express';
import { plainToClass } from 'class-transformer';

import { Middleware, UpdateChildDTO } from '../../models';
import { Child, Parent } from '../../database/entity';
import { childRoutes } from './child.routes';

const parent: Parent = plainToClass(Parent, {
    id: 1,
    email: 'test@mail.com',
    password: 'I Am Password',
    children: [
        {
            id: 1,
            username: 'Sarah Lang',
            grade: 3,
            week: 1,
            parent: undefined,
            preferences: {
                dyslexia: false,
            },
        },
        {
            id: 2,
            username: 'Joe Lang',
            grade: 5,
            week: 6,
            parent: undefined,
            preferences: {
                dyslexia: true,
            },
        },
    ],
});

const child: Child = plainToClass(Child, {
    id: 1,
    username: 'Sarah Lang',
    grade: 3,
    week: 1,
    parent: {
        id: 1,
        email: 'test@mail.com',
        password: 'I Am Password',
        children: undefined,
    },
    preferences: {
        dyslexia: false,
    },
});

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    save: jest.fn().mockImplementation(async (child: Child) => ({ ...child, id: 3 })),
    update: jest.fn().mockImplementation(async () => ({ affected: 1 })),
    delete: jest.fn().mockImplementation(async () => ({ affected: 1 })),
    findOne: jest.fn().mockImplementation(async () => ({ id: 1 })),
});

const UserInjection: Middleware = () => (req, res, next) => {
    if (req.headers.authorization === 'child') req.user = child;
    if (req.headers.authorization === 'parent') req.user = parent;
    next();
};

const BodyInjection: Middleware = () => (req, res, next) => {
    req.childUpdate = req?.body?.child;
    next();
};

const app = express();
app.use('/children', express.json(), BodyInjection(), UserInjection(), childRoutes);

describe('GET /children/list', () => {
    it('should list all children', async () => {
        const { body } = await request(app)
            .get('/children/list')
            .set({ Authorization: 'parent' });
        expect(body.children).toHaveLength(2);
    });

    it('should return 401 for children', async () => {
        await request(app)
            .get('/children/list')
            .set({ Authorization: 'child' })
            .expect(401);
    });
});

describe('GET /children/list/:id', () => {
    it('should return the requested child', async () => {
        const { body } = await request(app)
            .get('/children/list/1')
            .set({ Authorization: 'parent' });
        expect(body.child.id).toBe(1);
        expect(body.child.username).toBe('Sarah Lang');
    });

    it('should return 401 for children', async () => {
        await request(app)
            .get('/children/list/1')
            .set({ Authorization: 'child' })
            .expect(401);
    });
});

describe('POST /children/:id/login', () => {
    it('should return a jwt', async () => {
        const { body } = await request(app)
            .post('/children/1/login')
            .set({ Authorization: 'parent' });
        expect(body.token).not.toBe(null);
        expect(body.token).not.toBe(undefined);
    });

    it('should return 401 for children', async () => {
        await request(app)
            .post('/children/1/login')
            .set({ Authorization: 'child' })
            .expect(401);
    });
});

describe('POST /children/list', () => {
    it('should return the new child', async () => {
        const DTO: { child: UpdateChildDTO } = { child: { username: 'Joe', grade: 5 } };
        const { body } = await request(app)
            .post('/children/list')
            .send(DTO)
            .set({ Authorization: 'parent' });

        expect(body.child.username).toBe('Joe');
        expect(body.child.grade).toBe(5);
        expect(body.child.cohort.id).toBe(1);
    });

    it('should return 401 for children', async () => {
        await request(app)
            .post('/children/list')
            .set({ Authorization: 'child' })
            .expect(401);
    });

    describe('PUT /children/list/:id', () => {
        it('should return the updated child', async () => {
            const DTO: { child: UpdateChildDTO } = { child: { username: 'Sam', grade: 5 } };
            const { body } = await request(app)
                .put('/children/list/1')
                .send(DTO)
                .set({ Authorization: 'parent' });

            expect(body.child.username).toBe('Sam');
            expect(body.child.grade).toBe(5);
        });

        it('should return 401 for children', async () => {
            await request(app)
                .put('/children/list/1')
                .set({ Authorization: 'child' })
                .expect(401);
        });
    });

    describe('DELETE /children/list/:id', () => {
        it('should return 200 when deleted', async () => {
            await request(app)
                .delete('/children/list/1')
                .set({ Authorization: 'parent' })
                .expect(200);
        });

        it('should return 401 for children', async () => {
            await request(app)
                .put('/children/list/1')
                .set({ Authorization: 'child' })
                .expect(401);
        });
    });

    describe('GET /children/me', () => {
        it('should return the user the signed in child', async () => {
            const { body } = await request(app)
                .get('/children/me')
                .set({ Authorization: 'child' });
            expect(body.me.username).toBe('Sarah Lang');
        });

        it('should return 401 for parents', async () => {
            await request(app)
                .get('/children/me')
                .set({ Authorization: 'parent' })
                .expect(401);
        });
    });

    describe('GET /children/preferences', () => {
        it('should return the preferences of the signed in child', async () => {
            const { body } = await request(app)
                .get('/children/preferences')
                .set({ Authorization: 'child' });
            expect(body.preferences.dyslexia).toBe(false);
        });

        it('should return 401 for parents', async () => {
            await request(app)
                .get('/children/preferences')
                .set({ Authorization: 'parent' })
                .expect(401);
        });
    });

    describe('GET /children/me', () => {
        it('should return the parent of the signed in child', async () => {
            const { body } = await request(app)
                .get('/children/parent')
                .set({ Authorization: 'child' });
            expect(body.parent.email).toBe('test@mail.com');
        });

        it('should return 401 for parents', async () => {
            await request(app)
                .get('/children/parent')
                .set({ Authorization: 'parent' })
                .expect(401);
        });
    });
});
