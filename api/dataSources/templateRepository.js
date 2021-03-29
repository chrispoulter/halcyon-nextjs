import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.DYNAMODB_REGION,
    endpoint: config.DYNAMODB_ENDPOINT
});

export class TemplateRepository extends DataSource {
    async getByKey(key) {
        const params = {
            TableName: config.DYNAMODB_TEMPLATES,
            Key: { key }
        };

        const result = await dynamoDb.get(params).promise();

        return this._map(result.Item);
    }

    async create(template) {
        const params = {
            TableName: config.DYNAMODB_TEMPLATES,
            Item: {
                id: uuidv4(),
                ...template
            }
        };

        const result = await dynamoDb.put(params).promise();

        return this._map(result.Item);
    }

    async update(template) {
        const params = {
            TableName: config.DYNAMODB_TEMPLATES,
            Key: {
                key: template.key
            },
            ExpressionAttributeNames: {
                '#id': 'id',
                '#subject': 'subject',
                '#html': 'html'
            },
            ExpressionAttributeValues: {
                ':id': template.id,
                ':subject': template.subject,
                ':html': template.html
            },
            UpdateExpression:
                'SET #id = :id, #subject = :subject, #html = :html',
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDb.update(params).promise();

        return this._map(result.Attributes);
    }

    async remove(template) {
        const params = {
            TableName: config.DYNAMODB_TEMPLATES,
            Key: { key: template.key }
        };

        const result = await dynamoDb.delete(params).promise();

        return this._map(result.Item);
    }

    async upsert(template) {
        const existing = await this.getByKey(template.key);

        return existing
            ? this.update({ ...existing, ...template })
            : this.create(template);
    }

    async search(request) {
        const params = {
            TableName: config.DYNAMODB_TEMPLATES
        };

        const result = await dynamoDb.scan(params).promise();

        return {
            items: result.Items.map(this._map)
        };
    }

    _map = template => template;
}
