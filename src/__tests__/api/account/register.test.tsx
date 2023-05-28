import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/account/register';
import prisma from '@/utils/prisma';

jest.mock('next-auth/jwt', () => ({
    getToken: jest.fn()
}));

jest.mock('@/utils/prisma', () => ({
    __esModule: true,
    default: {
        users: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}));

describe('/api/account/register', () => {
    beforeEach(jest.clearAllMocks);

    it('handles model validation error', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: 'test@test.com',
                password: 'Testing123!',
                firstName: 'John',
                lastName: 'Smith'
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty('code', 'INVALID_REQUEST');
    });

    it('handles duplicate email address', async () => {
        (prisma.users.findUnique as jest.Mock).mockResolvedValue({});

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
        (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

        (prisma.users.create as jest.Mock).mockResolvedValue({
            id: 1,
        });

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
