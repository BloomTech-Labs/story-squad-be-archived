//jest & express
import * as request from 'supertest';
import * as express from 'express';
//setup consumables
import { plainToClass } from 'class-transformer';
import { noImage } from './story.test.consumables';
//entity
import { Child, Stories } from '../../../database/entity';
//routes
import { storyRoutes } from '../story.routes';

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
    stories: [
        {
            id: 1,
            week: 1,
            story: { page1: '', page2: '', page3: '', page4: '', page5: '' },
            storyText: 'Text1',
        },
        {
            id: 2,
            week: 2,
            story: { page1: '', page2: '', page3: '', page4: '', page5: '' },
            storyText: 'Text2',
        },
    ],
});

import typeorm = require('typeorm');
typeorm.getRepository = jest.fn().mockReturnValue({
    save: jest.fn().mockImplementation(async (story: Stories) => ({ ...story, id: 3 })),
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
app.use('/storyRoutes', express.json(), userInjection, bodyInjection, storyRoutes);

// describe('GET /storyRoutes', () => {
//     it("should list child's stories", async () => {
//         const { body } = await request(app).get('/storyRoutes');
//         expect(body.story).toHaveLength(2);
//     });
// });

// GET Block
describe('GET /storyRoutes/:week', () => {
    it("should list child's story for the week", async () => {
        const { body } = await request(app)
            .get('/storyRoutes/1')
            .expect(200);
        expect(body.story.id).toBe(1);
    });

    it('should return 404 if it does not exist', async () => {
        await request(app)
            .get('/storyRoutes/3')
            .expect(404);
    });
});

describe('GET /storyRoutes/children/:id', () => {
    it("should list child's story by id", async () => {
        const { body } = await request(app)
            .get('/storyRoutes/children/1')
            .expect(200);
        expect(body.story.id).toBe(1);
    });

    it('should return 404 if it does not exist', async () => {
        await request(app)
            .get('/storyRoutes/children/3')
            .expect(404);
    });

    // Post Block
    describe('POST /stories', () => {
        it('should return 201 on creation', async () => {
            await request(app)
                .post('/storyRoutes')
                .send({
                    storyText: 'Text3',
                    story: {
                        page1: '',
                        page2: '',
                        page3: '',
                        page4: '',
                        page5: '',
                    },
                })
                .expect(201);
        });

        it('should transcribe text from image', async () => {
            const { body } = await request(app)
                .post('/storyRoutes')
                .send({
                    storyText: '',
                    story: {
                        page1: noImage,
                        page2: '',
                        page3: '',
                        page4: '',
                        page5: '',
                    },
                });
            expect(body.transcribed.images[0].trim()).toBe('no image');
        });

        it('should return 400 if already exists', async () => {
            child.cohort.week = 1;
            await request(app)
                .post('/storyRoutes')
                .send({
                    storyText: 'Text2',
                    illustration: '',
                    story: {
                        page1: '',
                        page2: '',
                        page3: '',
                        page4: '',
                        page5: '',
                    },
                })
                .expect(400);
            child.cohort.week = 3;
        });
    });

    //Delete Block
    describe('DELETE /storyRoutes/:week', () => {
        it('should return 200 on deletion', async () => {
            await request(app)
                .delete('/storyRoutes/2')
                .expect(200);
        });

        it('should return 404 if it does not exist', async () => {
            await request(app)
                .delete('/storyRoutes/3')
                .expect(404);
        });
    });
