import { Client, query as q } from 'faunadb';
import { DataSource } from 'apollo-datasource';
import { base64EncodeObj, base64DecodeObj } from '../utils/encode';
import { config } from '../utils/config';

export class FaunaRepository extends DataSource {
    constructor(initialize) {
        super();

        if (initialize) {
            this.initialize();
        }
    }

    initialize() {
        this.client = new Client({
            secret: `${config.FAUNADB_SECRET}:${config.ENVIRONMENT}:server`
        });
    }

    async getItemById(collection, id) {
        try {
            const result = await this.client.query(
                q.Get(q.Ref(q.Collection(collection), id))
            );

            return this.mapItem(result);
        } catch (error) {
            if (error.name === 'NotFound') {
                return undefined;
            }

            throw error;
        }
    }

    async getItemByIndex(index, value) {
        try {
            const result = await this.client.query(
                q.Get(q.Match(q.Index(index), value))
            );

            return this.mapItem(result);
        } catch (error) {
            if (error.name === 'NotFound') {
                return undefined;
            }

            throw error;
        }
    }

    async createItem(collection, item) {
        const result = await this.client.query(
            q.Create(q.Collection(collection), { data: item })
        );

        return this.mapItem(result);
    }

    async updateItem(collection, item) {
        const { id, ...data } = item;

        const result = await this.client.query(
            q.Replace(q.Ref(q.Collection(collection), id), { data })
        );

        return this.mapItem(result);
    }

    async removeItem(collection, item) {
        const result = await this.client.query(
            q.Delete(q.Ref(q.Collection(collection), item.id))
        );

        return this.mapItem(result);
    }

    async searchItems({ index, search, size, cursor }) {
        const { before, after } = this.parseStringCursor(cursor);

        const set = search
            ? q.Filter(
                q.Match(index.name),
                q.Lambda(
                    index.values,
                    q.ContainsStr(
                        q.Casefold(q.Var(index.term)),
                        q.Casefold(search)
                    )
                )
            )
            : q.Match(q.Index(index.name));

        const result = await this.client.query(
            q.Map(
                q.Paginate(set, {
                    size: Math.min(size, 50),
                    before,
                    after
                }),
                q.Lambda(index.values, q.Get(q.Var('ref')))
            )
        );

        return {
            items: result.data.map(this.mapItem),
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

    mapItem = item => ({ id: item.ref.id, ...item.data });
}
