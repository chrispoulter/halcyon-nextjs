import { FaunaRepository } from '../utils/fauna';

const indexes = {
    BY_KEY: 'templates_by_key'
};

export class TemplateRepository extends FaunaRepository {
    getTemplateByKey = key => this.getItemByIndex(indexes.BY_KEY, key);
}
