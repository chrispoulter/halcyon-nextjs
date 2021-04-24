import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.REGION,
    endpoint: config.STAGE === 'local' ? 'http://localhost:8000' : undefined
});

const tableName = `halcyon-${config.STAGE}-entities`;

const searchFunc = user =>
    `${user.firstName} ${user.lastName} ${user.emailAddress}`;

const sortOptions = {
    NAME_ASC: {
        name: 'NAME_ASC',
        valueFunc: user => `${user.firstName} ${user.lastName}`
    },
    NAME_DESC: {
        name: 'NAME_DESC',
        valueFunc: user => `${user.firstName} ${user.lastName}`,
        desc: true
    },
    EMAIL_ADDRESS_ASC: {
        name: 'EMAIL_ADDRESS_ASC',
        valueFunc: user => user.emailAddress
    },
    EMAIL_ADDRESS_DESC: {
        name: 'EMAIL_ADDRESS_DESC',
        valueFunc: user => user.emailAddress,
        desc: true
    }
};

export class UserRepository extends DataSource {
    async getById(id) {
        const params = {
            TableName: tableName,
            Key: { pk: 'TYPE#USER', sk: `USER#${id}` }
        };

        const result = await dynamoDb.get(params).promise();

        return this._map(result.Item);
    }

    async getByEmailAddress(emailAddress) {
        const params = {
            TableName: tableName,
            IndexName: 'gs1-index',
            ExpressionAttributeNames: {
                '#gs1pk': 'gs1pk',
                '#gs1sk': 'gs1sk'
            },
            ExpressionAttributeValues: {
                ':gs1pk': 'TYPE#USER#EMAIL_ADDRESS',
                ':gs1sk': `USER#${emailAddress}`
            },
            KeyConditionExpression: '#gs1pk = :gs1pk AND #gs1sk = :gs1sk',
            Limit: 1
        };

        const result = await dynamoDb.query(params).promise();

        return this._map(result.Items[0]);
    }

    create = this.update;

    async update(user) {
        const item = this._generate(user);

        const params = {
            TableName: tableName,
            Item: item
        };

        await dynamoDb.put(params).promise();

        return this._map(item);
    }

    async remove(user) {
        const item = this._generate(user);

        const params = {
            TableName: tableName,
            Key: { pk: item.pk, sk: item.sk }
        };

        await dynamoDb.delete(params).promise();

        return this._map(item);
    }

    async upsert(user) {
        const existing = await this.getByEmailAddress(user.emailAddress);
        return this.update({ ...existing, ...user });
    }

    async search(request) {
        const users = this._search(
            await this._getAll(),
            searchFunc,
            request.search
        );

        this._sort(users, sortOptions[request.sort] || sortOptions.NAME_ASC);

        return this._paginate(users, request.page || 1, request.size || 10);
    }

    _getAll = async () => {
        const params = {
            TableName: tableName,
            ExpressionAttributeNames: {
                '#pk': 'pk',
                '#sk': 'sk'
            },
            ExpressionAttributeValues: { ':pk': 'TYPE#USER', ':sk': 'USER#' },
            KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
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
    };

    _search = (items, valueFunc, filter) => {
        if (!filter) {
            return items;
        }

        const lowerFilter = filter.toLowerCase();

        return items.filter(item =>
            valueFunc(item).toLowerCase().includes(lowerFilter)
        );
    };

    _sort = (items, { valueFunc, desc }) => {
        items.sort((a, b) =>
            valueFunc(a).toLowerCase() > valueFunc(b).toLowerCase()
                ? desc
                    ? -1
                    : 1
                : valueFunc(b).toLowerCase() > valueFunc(a).toLowerCase()
                ? desc
                    ? 1
                    : -1
                : 0
        );
    };

    _paginate = (items, page, size) => {
        const pageCount = (items.length + size - 1) / size;

        if (page > 1) {
            items = items.filter((_, i) => i >= (page - 1) * size);
        }

        return {
            items: items.filter((_, i) => i < size).map(this._map),
            hasNextPage: page < pageCount,
            hasPreviousPage: page > 1
        };
    };

    _generate = item => {
        const id = item.id || uuidv4();

        return {
            ...item,
            id,
            pk: 'TYPE#USER',
            sk: `USER#${id}`,
            gs1pk: 'TYPE#USER#EMAIL_ADDRESS',
            gs1sk: `USER#${item.emailAddress}`
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
