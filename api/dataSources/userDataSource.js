import { DynamoDBDataSource } from '../utils/data';

export class UserDataSource extends DynamoDBDataSource {
    entity = 'USER';
    gs1Key = 'emailAddress';

    searchFunc = user =>
        `${user.firstName} ${user.lastName} ${user.emailAddress}`;

    sortOptions = {
        DEFAULT: {
            name: 'NAME_ASC',
            valueFunc: user => `${user.firstName} ${user.lastName}`
        },
        NAME_DESC: {
            name: 'NAME_DESC',
            valueFunc: user => `${user.firstName} ${user.lastName}`,
            desc: true
        },
        EMAIL_ADDRESS_ASC: {
            name: 'EMAIL_ADDRESS_ASC',
            valueFunc: user => user.emailAddress
        },
        EMAIL_ADDRESS_DESC: {
            name: 'EMAIL_ADDRESS_DESC',
            valueFunc: user => user.emailAddress,
            desc: true
        }
    };

    getByEmailAddress = super.getByGs1;
}
