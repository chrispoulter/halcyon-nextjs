import { FaunaRepository } from './faunaRepository';

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
    getById = id => this._getById(collection, id);

    getByEmailAddress = emailAddress =>
        this._getByIndex(indexes.BY_EMAIL_ADDRESS, emailAddress);

    create = user => this._create(collection, user);

    update = user => this._update(collection, user);

    upsert = async user => {
        const existing = await this._getByIndex(
            indexes.BY_EMAIL_ADDRESS,
            user.emailAddress
        );

        return existing
            ? this._update(collection, { ...existing, ...user })
            : this._create(collection, user);
    };

    remove = user => this._remove(collection, user);

    search = request =>
        this._search({
            ...request,
            index: indexes[request.sort] || indexes.USERS_NAME_ASC
        });
}
