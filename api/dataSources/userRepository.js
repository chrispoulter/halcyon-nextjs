import { Client, query as q } from 'faunadb';
import { DataSource } from 'apollo-datasource';
import { base64EncodeObj, base64DecodeObj } from '../utils/encode';
import { config } from '../utils/config';

export class UserRepository extends DataSource {
    collections = {
        USERS: 'users'
    };

    indexes = {
        BY_EMAIL_ADDRESS: { name: 'users_by_email_address' },
        EMAIL_ADDRESS_DESC: {
            name: 'users_email_address_desc',
            values: ['emailAddress', 'firstName', 'lastName', 'ref']
        },
        EMAIL_ADDRESS_ASC: {
            name: 'users_email_address_asc',
            values: ['emailAddress', 'firstName', 'lastName', 'ref']
        },
        NAME_DESC: {
            name: 'users_name_desc',
            values: ['firstName', 'lastName', 'emailAddress', 'ref']
        },
        NAME_ASC: {
            name: 'users_name_asc',
            values: ['firstName', 'lastName', 'emailAddress', 'ref']
        }
    };

    errors = {
        NOT_FOUND: 'NotFound'
    };

    initialize() {
        this.client = new Client({
            secret: `${config.FAUNADB_SECRET}:${config.ENVIRONMENT}:server`
        });
    }

    async getUserById(id) {
        try {
            const result = await this.client.query(
                q.Get(q.Ref(q.Collection(this.collections.USERS), id))
            );

            return this.mapUser(result);
        } catch (error) {
            if (error.name === this.errors.NOT_FOUND) {
                return undefined;
            }

            throw error;
        }
    }

    async getUserByEmailAddress(emailAddress) {
        try {
            const result = await this.client.query(
                q.Get(
                    q.Match(
                        q.Index(this.indexes.BY_EMAIL_ADDRESS.name),
                        emailAddress
                    )
                )
            );

            return this.mapUser(result);
        } catch (error) {
            if (error.name === this.errors.NOT_FOUND) {
                return undefined;
            }

            throw error;
        }
    }

    async createUser(user) {
        const result = await this.client.query(
            q.Create(q.Collection(this.collections.USERS), { data: user })
        );

        return this.mapUser(result);
    }

    async updateUser(user) {
        const { id, ...data } = user;

        const result = await this.client.query(
            q.Replace(q.Ref(q.Collection(this.collections.USERS), id), { data })
        );

        return this.mapUser(result);
    }

    async removeUser(user) {
        const result = await this.client.query(
            q.Delete(q.Ref(q.Collection(this.collections.USERS), user.id))
        );

        return this.mapUser(result);
    }

    async searchUsers({ size, search, sort, cursor }) {
        const { name, values } =
            this.indexes[sort] || this.indexes.USERS_NAME_ASC;
        const { before, after } = this.parseStringCursor(cursor);

        const set = search
            ? q.Filter(
                  q.Match(name),
                  q.Lambda(
                      values,
                      q.ContainsStr(
                          q.Casefold(q.Var('emailAddress')),
                          q.Casefold(search)
                      )
                  )
              )
            : q.Match(q.Index(name));

        const result = await this.client.query(
            q.Map(
                q.Paginate(set, {
                    size: Math.min(size, 50),
                    before,
                    after
                }),
                q.Lambda(values, q.Get(q.Var('ref')))
            )
        );

        return {
            items: result.data.map(this.mapUser),
            ...this.generateStringCursors(result)
        };
    }

    generateStringItems(arr) {
        if (!arr) {
            return undefined;
        }

        return arr.map(item => {
            if (!item.collection) {
                return item;
            }

            return { collection: item.collection.id, id: item.id };
        });
    }

    generateStringCursors(cursors) {
        const before =
            cursors.before &&
            base64EncodeObj({
                before: this.generateStringItems(cursors.before)
            });

        const after =
            cursors.after &&
            base64EncodeObj({ after: this.generateStringItems(cursors.after) });

        return { before, after };
    }

    parseStringItems(arr) {
        if (!arr) {
            return undefined;
        }

        return arr.map(item => {
            if (!item.collection) {
                return item;
            }

            return q.Ref(q.Collection(item.collection), item.id);
        });
    }

    parseStringCursor(str) {
        const decoded = base64DecodeObj(str);

        const before =
            decoded && decoded.before && this.parseStringItems(decoded.before);

        const after =
            decoded && decoded.after && this.parseStringItems(decoded.after);

        return { before, after };
    }

    mapUser(user) {
        return { id: user.ref.id, ...user.data };
    }
}
