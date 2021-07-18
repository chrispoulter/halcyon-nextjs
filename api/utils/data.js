import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.AWS_REGION,
    endpoint: config.AWS_DYNAMODB_ENDPOINT
});

const tableName = `halcyon-${config.STAGE}-entities`;

export class DynamoDBDataSource extends DataSource {
    async getById(id) {
        const params = {
            TableName: tableName,
            Key: { pk: `TYPE#${this.entity}`, sk: `${this.entity}#${id}` }
        };

        const result = await dynamoDb.get(params).promise();

        return this._map(result.Item);
    }

    async getByGs1(id) {
        const params = {
            TableName: tableName,
            IndexName: 'gs1-index',
            ExpressionAttributeNames: {
                '#gs1pk': 'gs1pk',
                '#gs1sk': 'gs1sk'
            },
            ExpressionAttributeValues: {
                ':gs1pk': `TYPE#${this.entity}#${this.gs1Key}`,
                ':gs1sk': `${this.entity}#${id}`
            },
            KeyConditionExpression: '#gs1pk = :gs1pk AND #gs1sk = :gs1sk',
            Limit: 1
        };

        const result = await dynamoDb.query(params).promise();

        return this._map(result.Items[0]);
    }

    create = this.update;

    async update(item) {
        const data = this._generate(item);

        const params = {
            TableName: tableName,
            Item: data
        };

        await dynamoDb.put(params).promise();

        return this._map(data);
    }

    async upsert(item) {
        const id = item[this.gs1Key];
        const existing = await this.getByGs1(id);
        return this.update({ ...existing, ...item });
    }

    async remove(item) {
        const data = this._generate(item);

        const params = {
            TableName: tableName,
            Key: { pk: data.pk, sk: data.sk }
        };

        await dynamoDb.delete(params).promise();

        return this._map(data);
    }

    async search(request) {
        let items = await this._getAll();

        if (request.search) {
            const search = request.search.toLowerCase();

            items = items.filter(item =>
                this.searchFunc(item).toLowerCase().includes(search)
            );
        }

        const { valueFunc, desc } =
            this.sortOptions[request.sort] || this.sortOptions.DEFAULT;

        items.sort((item1, item2) =>
            valueFunc(item1).toLowerCase() > valueFunc(item2).toLowerCase()
                ? desc
                    ? -1
                    : 1
                : valueFunc(item2).toLowerCase() >
                  valueFunc(item1).toLowerCase()
                ? desc
                    ? 1
                    : -1
                : 0
        );

        const page = Math.max(request.page || 1, 1);
        const size = Math.min(request.size || 50, 50);
        const pageCount = (items.length + size - 1) / size;

        const hasNextPage = page < pageCount;
        const hasPreviousPage = page > 1;

        if (page > 1) {
            items = items.filter((_, index) => index >= (page - 1) * size);
        }

        items = items.filter((_, index) => index < size);

        return {
            items: items.map(this._map),
            hasNextPage,
            hasPreviousPage
        };
    }

    _getAll = async () => {
        const params = {
            TableName: tableName,
            ExpressionAttributeNames: {
                '#pk': 'pk',
                '#sk': 'sk'
            },
            ExpressionAttributeValues: {
                ':pk': `TYPE#${this.entity}`,
                ':sk': `${this.entity}#`
            },
            KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
            Limit: 1
        };

        let items = [];
        let result;

        do {
            result = await dynamoDb.query(params).promise();
            items.push(...result.Items);
            params.ExclusiveStartKey = result.LastEvaluatedKey;
        } while (result.LastEvaluatedKey !== undefined);

        return items;
    };

    _generate = item => {
        const id = item.id || uuidv4();

        return {
            ...item,
            id,
            pk: `TYPE#${this.entity}`,
            sk: `${this.entity}#${id}`,
            gs1pk: `TYPE#${this.entity}#${this.gs1Key}`,
            gs1sk: `${this.entity}#${item[this.gs1Key]}`
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
