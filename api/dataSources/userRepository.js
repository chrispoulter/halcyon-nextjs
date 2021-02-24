import { FaunaRepository } from '../utils/fauna';

const collection = 'users';

const indexes = {
    BY_EMAIL_ADDRESS: 'users_by_email_address',
    EMAIL_ADDRESS_DESC: {
        name: 'users_email_address_desc',
        term: 'emailAddress',
        values: ['emailAddress', 'firstName', 'lastName', 'ref']
    },
    EMAIL_ADDRESS_ASC: {
        name: 'users_email_address_asc',
        term: 'emailAddress',
        values: ['emailAddress', 'firstName', 'lastName', 'ref']
    },
    NAME_DESC: {
        name: 'users_name_desc',
        term: 'emailAddress',
        values: ['firstName', 'lastName', 'emailAddress', 'ref']
    },
    NAME_ASC: {
        name: 'users_name_asc',
        term: 'emailAddress',
        values: ['firstName', 'lastName', 'emailAddress', 'ref']
    }
};

export class UserRepository extends FaunaRepository {
    getUserById = id => this.getItemById(collection, id);

    getUserByEmailAddress = emailAddress =>
        this.getItemByIndex(indexes.BY_EMAIL_ADDRESS, emailAddress);

    createUser = user => this.createItem(collection, user);

    updateUser = user => this.updateItem(collection, user);

    removeUser = user => this.removeItem(collection, user);

    searchUsers = request =>
        this.searchItems({
            ...request,
            index: indexes[request.sort] || indexes.USERS_NAME_ASC
        });
}
