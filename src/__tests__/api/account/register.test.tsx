import { createMocks } from 'node-mocks-http';
import { Users } from '@prisma/client';
import handler from '@/pages/api/account/register';
import prisma from '@/utils/prisma';

jest.mock('next-auth/jwt', () => ({
    getToken: jest.fn()
}));

const user: Users = {
    id: 1,
    emailAddress: 'test@test.com',
    password: 'Testing123!',
    passwordResetToken: null,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date(1970, 0, 1),
    isLockedOut: false,
    roles: []
};

describe('/api/account/register', () => {
    beforeEach(jest.clearAllMocks);

    it('handles model validation error', async () => {
        const { req, res } = createMocks({
            method: 'POST'
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty('code', 'INVALID_REQUEST');
    });

    it('handles duplicate email address', async () => {
        jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(user);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: 'test@test.com',
                password: 'Testing123!',
                firstName: 'John',
                lastName: 'Smith',
                dateOfBirth: new Date(1970, 0, 1)
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty('code', 'DUPLICATE_USER');
    });

    it('creates new user', async () => {
        jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);
        jest.spyOn(prisma.users, 'create').mockResolvedValue(user);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: 'test@test.com',
                password: 'Testing123!',
                firstName: 'John',
                lastName: 'Smith',
                dateOfBirth: new Date(1970, 0, 1)
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(200);

        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty('code', 'USER_REGISTERED');
    });
});
