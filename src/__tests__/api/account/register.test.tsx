import { createMocks } from 'node-mocks-http';
import { when } from 'jest-when';
import { Users } from '@prisma/client';
import handler from '@/pages/api/account/register';
import prisma from '@/utils/prisma';
import { toDateOnly } from '@/utils/dates';

const user: Users = {
    id: 1,
    emailAddress: 'test@example.com',
    password: 'change-me-1234567890',
    passwordResetToken: null,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date('1970-01-01T00:00:00.000Z'),
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

        const data = res._getJSONData();
        expect(data).toHaveProperty(
            'message',
            'One or more validation errors occurred.'
        );
    });

    it('when duplicate email address should return bad request', async () => {
        when(prisma.users.count).mockResolvedValue(1);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: user.emailAddress,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: toDateOnly(user.dateOfBirth)
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = res._getJSONData();
        expect(data).toHaveProperty('message', 'User name is already taken.');
    });

    it('when request is valid should create new user', async () => {
        when(prisma.users.count).mockResolvedValue(0);
        when(prisma.users.create).mockResolvedValue(user);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: user.emailAddress,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: toDateOnly(user.dateOfBirth)
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(200);

        const data = res._getJSONData();
        expect(data).toHaveProperty('id', user.id);
    });
});
