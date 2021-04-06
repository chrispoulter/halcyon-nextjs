import { UserRepository } from './userRepository';
import { TemplateRepository } from './templateRepository';

export const dataSources = () => ({
    users: new UserRepository(),
    templates: new TemplateRepository()
});
