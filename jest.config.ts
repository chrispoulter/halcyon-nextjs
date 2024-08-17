import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './'
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testEnvironment: 'jest-environment-jsdom',
    modulePathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/tests']
};

export default createJestConfig(customJestConfig);
