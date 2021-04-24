import { UserRepository } from './userRepository';
import { TemplateRepository } from './templateRepository';
import { DynamoDBRepository } from './dynamoDBRepository';

export const dataSources = () => ({
    users: new UserRepository(),
    templates: new TemplateRepository(),
    dynamo: new DynamoDBRepository()
});
