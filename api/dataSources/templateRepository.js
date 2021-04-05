import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.REGION,
    endpoint: config.STAGE === 'local' ? 'http://localhost:8000' : undefined
});

const tableName = `halcyon-${config.STAGE}-templates`;

export class TemplateRepository extends DataSource {
    async getByKey(key) {
        const params = {
            TableName: tableName,
            Key: { key }
        };

        const result = await dynamoDb.get(params).promise();

        return this._map(result.Item);
    }

    async update(template) {
        const params = {
            TableName: tableName,
            Item: template
        };

        await dynamoDb.put(params).promise();

        return this._map(template);
    }

    async upsert(template) {
        const existing = await this.getByKey(template.key);
        return this.update({ ...existing, ...template });
    }

    _map = item => {
        if (!item) {
            return undefined;
        }

        return {
            key: item.key,
            subject: item.subject,
            html: item.html
        };
    };
}
