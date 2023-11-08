import { createMocks } from 'node-mocks-http';
import { when } from 'jest-when';
import handler from '@/pages/api/account/register';
import { query } from '@/data/db';
import { User } from '@/data/schema';

const user: User = {
    id: 1,
    email_address: 'test@example.com',
    password: 'change-me-1234567890',
    password_reset_token: undefined,
    first_name: 'John',
    last_name: 'Smith',
    date_of_birth: '1970-01-01',
    is_locked_out: false,
    roles: [],
    xmin: 1234,
    search: 'search text'
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
        when(query<User>)
            .calledWith(expect.stringContaining('SELECT'), expect.anything())
            .mockResolvedValue({
                rows: [user],
                rowCount: 1,
                command: 'SELECT',
                oid: 1,
                fields: []
            });
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: user.email_address,
                password: user.password,
                firstName: user.first_name,
                lastName: user.last_name,
                dateOfBirth: user.date_of_birth
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(400);

        const data = res._getJSONData();
        expect(data).toHaveProperty('message', 'User name is already taken.');
    });

    it('when request is valid should create new user', async () => {
        when(query<User>)
            .calledWith(expect.stringContaining('SELECT'), expect.anything())
            .mockResolvedValue({
                rows: [],
                rowCount: 1,
                command: 'SELECT',
                oid: 1,
                fields: []
            });

        when(query<User>)
            .calledWith(expect.stringContaining('INSERT'), expect.anything())
            .mockResolvedValue({
                rows: [user],
                rowCount: 1,
                command: 'INSERT',
                oid: 1,
                fields: []
            });

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                emailAddress: user.email_address,
                password: user.password,
                firstName: user.first_name,
                lastName: user.last_name,
                dateOfBirth: user.date_of_birth
            }
        });

        await handler(req, res);

        const statusCode = res._getStatusCode();
        expect(statusCode).toBe(200);

        const data = res._getJSONData();
        expect(data).toHaveProperty('id', user.id);
    });
});
