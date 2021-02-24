import { UserRepository } from './userRepository';

export const dataSources = () => ({
    users: new UserRepository()
});
