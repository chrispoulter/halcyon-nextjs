import { createMocks } from 'node-mocks-http';
import { when } from 'jest-when';
import handler from '@/pages/api/account/register';
import { User, createUser, getUserByEmailAddress } from '@/data/userRepository';

const user: User = {
    id: 1,
    emailAddress: 'test@example.com',
    password: 'change-me-1234567890',
    passwordResetToken: undefined,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1970-01-01',
    isLockedOut: false,
    roles: [],
    version: 1234
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
        when(getUserByEmailAddress).mockResolvedValue(user);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: user.emailAddress,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = res._getJSONData();
        expect(data).toHaveProperty('message', 'User name is already taken.');
    });

    it('when request is valid should create new user', async () => {
        when(getUserByEmailAddress).mockResolvedValue(undefined);
        when(createUser).mockResolvedValue(user.id);

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: user.emailAddress,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(200);

        const data = res._getJSONData();
        expect(data).toHaveProperty('id', user.id);
    });
});
