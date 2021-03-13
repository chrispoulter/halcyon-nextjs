import { UserRepository } from './userRepository';
import { TemplateRepository } from './templateRepository';

export const dataSources = initialize => ({
    users: new UserRepository(initialize),
    templates: new TemplateRepository(initialize)
});
