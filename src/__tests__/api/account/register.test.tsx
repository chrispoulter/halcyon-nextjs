import { createMocks } from 'node-mocks-http';
import { Users } from '@prisma/client';
import handler from '@/pages/api/account/register';
import prisma from '@/utils/prisma';

jest.mock('next-auth/jwt', () => ({
    getToken: jest.fn()
}));

Object.defineProperty(globalThis, 'crypto', {
    value: {
        randomUUID: jest.fn()
    }
});

const user: Users = {
    id: 1,
    emailAddress: 'test@example.com',
    password: 'Testing123!',
    passwordResetToken: null,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date(1970, 0, 1),
    isLockedOut: false,
    roles: [],
    search: 'John Smith',
    version: '1234'
};

describe('/api/account/register', () => {
    beforeEach(jest.clearAllMocks);

    it('when request invalid should return bad request', async () => {
        const { req, res } = createMocks({
            method: 'POST'
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty(
            'message',
            'One or more validation errors occurred.'
        );
    });

    it('when duplicate email address should return bad request', async () => {
        jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(user);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: 'test@example.com',
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
        expect(data).toHaveProperty('message', 'User name is already taken.');
    });

    it('when request is valid should create new user', async () => {
        jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);
        jest.spyOn(prisma.users, 'create').mockResolvedValue(user);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: 'test@example.com',
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
        expect(data).toHaveProperty('id', user.id);
    });
});
