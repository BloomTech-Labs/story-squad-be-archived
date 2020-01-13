import * as dotenv from 'dotenv';
import { Hash, ValidateHash } from './hash.middleware';
import typeorm = require('typeorm');

//Requires salt 3
typeorm.getRepository = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue([
        {
            email: 'Test@mail.com',
            password: '$2a$10$wOMxfPlKxunOi9ZqQ1ND9eJC4frWYmCaMRMaM.GESdvn8NR.c2FBq', //Test1234
        },
    ]),
});

describe('Hash()', () => {
    it('should call next() if there are no errors', async () => {
        const req: any = { register: { email: 'testing@mail.com', password: 'testing1234' } };
        const res: any = () => ({
            send: jest.fn(),
        });
        const next = jest.fn();

        await Hash()(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should not call next() if there is no password', async () => {
        const req: any = { register: { email: 'testing@mail.com' } };
        const res: any = {
            status: () => ({
                send: jest.fn(),
            }),
        };
        const next = jest.fn();

        await Hash()(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});

describe('ValidateHash()', () => {
    it('should call next() if the password is correct', async () => {
        const req: any = { login: { email: 'Test@mail.com', password: 'Test1234' } };
        const res: any = {
            status: () => ({
                send: jest.fn(),
            }),
        };
        const next = jest.fn();
        await ValidateHash()(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should not call next() if the password is wrong', async () => {
        const req: any = { login: { email: 'Test@mail.com', password: 'WRONG' } };
        const res: any = {
            status: () => ({
                send: jest.fn(),
            }),
        };
        const next = jest.fn();
        await ValidateHash()(req, res, next);

        expect(next).not.toHaveBeenCalled();
    });
});
