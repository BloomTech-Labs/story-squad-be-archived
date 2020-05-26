//jest & express
import * as request from 'supertest';
import * as express from 'express';
//setup consumables
import { plainToClass } from 'class-transformer';
import { noImage } from './illustration.test.consumables';
//entity
import { Child, Illustrations } from '../../../database/entity';
//routes
import { illustrationRoutes } from '../illustration.routes';

const child: Child = plainToClass(Child, {
    id: 1,
    username: 'Sarah Lang',
    grade: 3,
    parent: {
        id: 1,
        email: 'test@mail.com',
        password: 'I Am Password',
        children: undefined,
    },
    cohort: {
        week: 3,
    },
    preferences: {
        dyslexia: false,
    },
    illustrations: [
        {
            id: 1,
            week: 1,
            illustration: noImage,
        },
        {
            id: 2,
            week: 2,
            illustration: noImage,
        },
    ],
});

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    save: jest
        .fn()
        .mockImplementation(async (illustration: Illustrations) => ({ ...illustration, id: 3 })),
    update: jest.fn().mockImplementation(async () => ({ affected: 1 })),
    delete: jest.fn().mockImplementation(async () => ({ affected: 1 })),
});

jest.mock('../../../middleware', () => ({
    Only: () => (req, res, next) => {
        next();
    },
}));

const userInjection = (req, res, next) => {
    req.user = child;
    next();
};

const bodyInjection = (req, res, next) => {
    if (req.body) res.locals.body = req.body;
    next();
};

const app = express();
app.use('/illustrationRoutes', express.json(), userInjection, bodyInjection, illustrationRoutes);

// this route currently doesn't exist within illustrationRoutes

// describe('GET /illustrationRoutes', () => {
//     it("should list child's illustrations", async () => {
//         const { body } = await request(app).get('/illustrationRoutes');
//         expect(body.illustration).toHaveLength(2);
//     });
// });

describe('GET /illustrationRoutes/:week', () => {
    it("should list child's illustration for the week", async () => {
        const { body } = await request(app)
            .get('/illustrationRoutes/1')
            .expect(200);
        expect(body.illustration.id).toBe(1);
    });

    it('should return 404 if it does not exist', async () => {
        await request(app)
            .get('/illustrationRoutes/3')
            .expect(404);
    });
});

describe('GET /illustrationRoutes/children/:id', () => {
    it("should list child's illustration by id", async () => {
        const { body } = await request(app)
            .get('/illustrationRoutes/children/1')
            .expect(200);
        expect(body.illustration.id).toBe(1);
    });

    it('should return 404 if it does not exist', async () => {
        await request(app)
            .get('/illustrationRoutes/children/3')
            .expect(404);
    });
});

// Post Block
describe('POST /illustrationRoutes', () => {
    it('should return 201 on creation', async () => {
        await request(app)
            .post('/illustrationRoutes')
            .send({
                illustration: noImage,
            })
            .expect(201);
    });

    it('should return 400 if already exists', async () => {
        child.cohort.week = 1;
        await request(app)
            .post('/illustrationRoutes')
            .send({
                illustration: noImage,
            })
            .expect(400);
        child.cohort.week = 3;
    });
});

//Delete Block
describe('DELETE /illustrationRoutes/:week', () => {
    it('should return 200 on deletion', async () => {
        await request(app)
            .delete('/illustrationRoutes/2')
            .expect(200);
    });

    it('should return 404 if it does not exist', async () => {
        await request(app)
            .delete('/illustrationRoutes/3')
            .expect(404);
    });
});
