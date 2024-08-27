import '@testing-library/jest-dom';

import jestFetchMock from 'jest-fetch-mock';
jestFetchMock.enableMocks();

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
    getServerSession: jest.fn()
}));

jest.mock('next-auth/react', () => ({
    __esModule: true,
    getSession: jest.fn(),
    signIn: jest.fn()
}));
