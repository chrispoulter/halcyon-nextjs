import { DynamoDBDataSource } from '../utils/data';

export class TemplateDataSource extends DynamoDBDataSource {
    entity = 'TEMPLATE';
    gs1Key = 'key';

    searchFunc = template => template.key;

    sortOptions = {
        DEFAULT: {
            name: 'KEY_ASC',
            valueFunc: template => template.key
        }
    };

    getByKey = super.getByGs1;
}
