import { UserRepository } from './userRepository';
import { TemplateRepository } from './templateRepository';

export const dataSources = database => ({
    users: new UserRepository(database),
    templates: new TemplateRepository(database)
});
