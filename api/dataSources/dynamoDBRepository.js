import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.REGION,
    endpoint: config.STAGE === 'local' ? 'http://localhost:8000' : undefined
});

const tableName = `halcyon-${config.STAGE}-entities`;

export class DynamoDBRepository extends DataSource {
    async getByPk(pk, sk) {
        const params = {
            TableName: tableName,
            Key: { pk, sk }
        };

        const result = await dynamoDb.get(params).promise();

        return result.Item;
    }

    async getByGs1pk(pk, sk) {
        const params = {
            TableName: tableName,
            IndexName: 'gs1-index',
            ExpressionAttributeNames: {
                '#gs1pk': 'gs1pk',
                '#gs1sk': 'gs1sk'
            },
            ExpressionAttributeValues: { ':gs1pk': pk, ':gs1sk': sk },
            KeyConditionExpression: '#gs1pk = :gs1pk AND #gs1sk = :gs1sk',
            Limit: 1
        };

        const result = await dynamoDb.query(params).promise();

        return result.Items[0];
    }

    create = this.update;

    async update(item) {
        const params = {
            TableName: tableName,
            Item: item
        };

        await dynamoDb.put(params).promise();

        return item;
    }

    async upsert(item) {
        const existing = await this.getByGs1pk(item.gs1pk, item.gs1sk);
        return this.update({ ...existing, ...item });
    }

    async remove(item) {
        const params = {
            TableName: tableName,
            Key: { pk: item.pk, sk: item.sk }
        };

        await dynamoDb.delete(params).promise();
    }

    async getAll(pk, sk) {
        const params = {
            TableName: tableName,
            ExpressionAttributeNames: {
                '#pk': 'pk',
                '#sk': 'sk'
            },
            ExpressionAttributeValues: { ':pk': pk, ':sk': sk },
            KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
            Limit: 1
        };

        let items = [];
        let result;

        do {
            result = await dynamoDb.query(params).promise();
            result.Items.forEach(item => items.push(item));
            params.ExclusiveStartKey = result.LastEvaluatedKey;
        } while (result.LastEvaluatedKey !== undefined);

        return items;
    }
}
