import '@testing-library/jest-dom';

import jestFetchMock from 'jest-fetch-mock';
jestFetchMock.enableMocks();

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('next-auth/react', () => ({
    __esModule: true,
    useSession: jest.fn(() => ({})),
    signIn: jest.fn()
}));

jest.mock('@/lib/auth', () => ({
    auth: jest.fn()
}));
