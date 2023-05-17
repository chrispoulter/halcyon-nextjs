import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/hello';

jest.mock('next-auth/jwt', () => ({
    getToken: jest.fn()
}));

describe('/api/hello', () => {
    it('should return an object with a message', () => {
        const { req, res } = createMocks();

        handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toHaveProperty('message');
    });
});
