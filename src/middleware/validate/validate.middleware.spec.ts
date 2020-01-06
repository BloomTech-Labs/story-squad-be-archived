import { Validation } from './validate.middleware';

describe('Validation()', () => {
    it('should return a error if username is not an email', async () => {
        const req: any = {
            path: '/auth/register',
            body: { username: 'test', password: 'Test1234', termsOfService: true },
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
        expect(res.json).toHaveBeenCalledWith({ errors: ['username must be an email'] });
    });

    it('should return a error if termsOfService is not a boolean', async () => {
        const req: any = {
            path: '/auth/register',
            body: { username: 'Test@mail.com', password: 'Test1234', termsOfService: '' },
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
            errors: ['termsOfService must be a boolean value'],
        });
    });

    it('should return a error if password is not at least 8 characters', async () => {
        const req: any = {
            path: '/auth/register',
            body: { username: 'Test@mail.com', password: 'Test123', termsOfService: true },
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
            errors: ['password must be longer than or equal to 8 characters'],
        });
    });
});
