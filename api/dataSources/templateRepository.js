import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.REGION,
    endpoint: config.STAGE === 'local' ? 'http://localhost:8000' : undefined
});

const tableName = `halcyon-${config.STAGE}-entities`;

export class TemplateRepository extends DataSource {
    async getByKey(key) {
        const params = {
            TableName: tableName,
            IndexName: 'gs1-index',
            ExpressionAttributeNames: {
                '#gs1pk': 'gs1pk',
                '#gs1sk': 'gs1sk'
            },
            ExpressionAttributeValues: {
                ':gs1pk': 'TYPE#TEMPLATE#KEY',
                ':gs1sk': `TEMPLATE#${key}`
            },
            KeyConditionExpression: '#gs1pk = :gs1pk AND #gs1sk = :gs1sk',
            Limit: 1
        };

        const result = await dynamoDb.query(params).promise();

        return this._map(result.Items[0]);
    }

    async update(template) {
        const item = this._generate(template);

        const params = {
            TableName: tableName,
            Item: item
        };

        await dynamoDb.put(params).promise();

        return this._map(item);
    }

    async upsert(template) {
        const existing = await this.getByKey(template.key);
        return this.update({ ...existing, ...template });
    }

    _generate = item => {
        const id = item.id || uuidv4();

        return {
            ...item,
            id,
            pk: 'TYPE#TEMPLATE',
            sk: `TEMPLATE#${id}`,
            gs1pk: 'TYPE#TEMPLATE#KEY',
            gs1sk: `TEMPLATE#${item.key}`
        };
    };

    _map = item => {
        if (!item) {
            return undefined;
        }

        const { pk, sk, gs1pk, gs1sk, ...rest } = item;

        return rest;
    };
}
