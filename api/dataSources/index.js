import { UserDataSource } from './userDataSource';
import { TemplateDataSource } from './templateDataSource';

export const dataSources = () => ({
    users: new UserDataSource(),
    templates: new TemplateDataSource()
});
