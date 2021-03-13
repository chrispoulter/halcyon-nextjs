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
        this._client = new Client({
            secret: `${config.FAUNADB_SECRET}:${config.ENVIRONMENT}:server`
        });
    }

    async _getById(collection, id) {
        try {
            const result = await this._client.query(
                q.Get(q.Ref(q.Collection(collection), id))
            );

            return this._map(result);
        } catch (error) {
            if (error.name === 'NotFound') {
                return undefined;
            }

            throw error;
        }
    }

    async _getByIndex(index, value) {
        try {
            const result = await this._client.query(
                q.Get(q.Match(q.Index(index), value))
            );

            return this._map(result);
        } catch (error) {
            if (error.name === 'NotFound') {
                return undefined;
            }

            throw error;
        }
    }

    async _create(collection, item) {
        const result = await this._client.query(
            q.Create(q.Collection(collection), { data: item })
        );

        return this._map(result);
    }

    async _update(collection, item) {
        const { id, ...data } = item;

        const result = await this._client.query(
            q.Replace(q.Ref(q.Collection(collection), id), { data })
        );

        return this._map(result);
    }

    async _remove(collection, item) {
        const result = await this._client.query(
            q.Delete(q.Ref(q.Collection(collection), item.id))
        );

        return this._map(result);
    }

    async _search({ index, search, size, cursor }) {
        const { before, after } = this._parseStringCursor(cursor);

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

        const result = await this._client.query(
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
            items: result.data.map(this._map),
            ...this._generateStringCursors(result)
        };
    }

    _generateStringItems(arr) {
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

    _generateStringCursors(cursors) {
        const before =
            cursors.before &&
            base64EncodeObj({
                before: this._generateStringItems(cursors.before)
            });

        const after =
            cursors.after &&
            base64EncodeObj({
                after: this._generateStringItems(cursors.after)
            });

        return { before, after };
    }

    _parseStringItems(arr) {
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

    _parseStringCursor(str) {
        const decoded = base64DecodeObj(str);

        const before =
            decoded && decoded.before && this._parseStringItems(decoded.before);

        const after =
            decoded && decoded.after && this._parseStringItems(decoded.after);

        return { before, after };
    }

    _map = item => ({ id: item.ref.id, ...item.data });
}
