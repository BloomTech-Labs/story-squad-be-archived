import { Validation } from './validate.middleware';

describe('Validation()', () => {
    it('should return a error if email is not an email', async () => {
        const req: any = {
            path: '/auth/register',
            method: 'POST',
            body: { email: 'test', password: 'Test1234', termsOfService: true },
        };
        const res: any = {
            json: jest.fn(),
            status: () => ({
                json: res.json,
            }),
        };
        const next = jest.fn();

        await Validation()(req, res, next);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            errors: ['Your username must be an email address...'],
        });
    });

    it('should return a error if termsOfService is not a boolean', async () => {
        const req: any = {
            path: '/auth/register',
            method: 'POST',
            body: { email: 'Test@mail.com', password: 'Test1234', termsOfService: '' },
        };
        const res: any = {
            json: jest.fn(),
            status: () => ({
                json: res.json,
            }),
        };
        const next = jest.fn();

        await Validation()(req, res, next);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            errors: ['Your must accept the terms of service before registering...'],
        });
    });

    it('should return a error if password is not at least 8 characters', async () => {
        const req: any = {
            path: '/auth/register',
            method: 'POST',
            body: { email: 'Test@mail.com', password: 'Test123', termsOfService: true },
        };
        const res: any = {
            json: jest.fn(),
            status: () => ({
                json: res.json,
            }),
        };
        const next = jest.fn();

        await Validation()(req, res, next);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            errors: ['Your password must be between 8 and 32 characters long...'],
        });
    });
});
