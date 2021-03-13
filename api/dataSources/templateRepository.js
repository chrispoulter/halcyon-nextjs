import { FaunaRepository } from './faunaRepository';

const collection = 'templates';

const indexes = {
    BY_KEY: 'templates_by_key'
};

export class TemplateRepository extends FaunaRepository {
    getByKey = key => this._getByIndex(indexes.BY_KEY, key);

    create = template => this._create(collection, template);

    update = template => this._update(collection, template);

    upsert = async template => {
        const existing = await this._getByIndex(indexes.BY_KEY, template.key);

        return existing
            ? this._update(collection, { ...existing, ...template })
            : this._create(collection, template);
    };
}
