import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.REGION,
    endpoint: config.DYNAMODB_ENDPOINT
});

const indexes = {
    EMAIL_ADDRESS: 'emailAddress-index'
};

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
            TableName: config.DYNAMODB_USERS,
            Key: { id }
        };

        const result = await dynamoDb.get(params).promise();

        return this._map(result.Item);
    }

    async getByEmailAddress(emailAddress) {
        const params = {
            TableName: config.DYNAMODB_USERS,
            IndexName: indexes.EMAIL_ADDRESS,
            ExpressionAttributeNames: { '#emailAddress': 'emailAddress' },
            ExpressionAttributeValues: { ':emailAddress': emailAddress },
            KeyConditionExpression: '#emailAddress = :emailAddress',
            Limit: 1
        };

        const result = await dynamoDb.query(params).promise();

        return this._map(result.Items[0]);
    }

    create = this.update;

    async update(user) {
        const item = this._generate(user);

        const params = {
            TableName: config.DYNAMODB_USERS,
            Item: item
        };

        await dynamoDb.put(params).promise();

        return this._map(item);
    }

    async remove(user) {
        const params = {
            TableName: config.DYNAMODB_USERS,
            Key: { id: user.id }
        };

        await dynamoDb.delete(params).promise();

        return this._map(user);
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
            TableName: config.DYNAMODB_USERS
        };

        let items = [];
        let result;

        do {
            result = await dynamoDb.scan(params).promise();
            result.Items.forEach(item => items.push(item));
            params.ExclusiveStartKey = result.LastEvaluatedKey;
        } while (result.LastEvaluatedKey !== undefined);

        return items;
    };

    _search = (items, valueFunc, filter) => {
        if (!filter) {
            return items;
        }

        return items.filter(item =>
            valueFunc(item).toLowerCase().includes(filter.toLowerCase())
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

    _generate = item => ({
        ...item,
        id: item.id || uuidv4(),
        isLockedOut: item.isLockedOut,
        password: item.password,
        passwordResetToken: item.passwordResetToken
    });

    _map = item => {
        if (!item) {
            return undefined;
        }

        return {
            id: item.id,
            emailAddress: item.emailAddress,
            password: item.password,
            firstName: item.firstName,
            lastName: item.lastName,
            dateOfBirth: item.dateOfBirth,
            isLockedOut: item.isLockedOut,
            passwordResetToken: item.passwordResetToken,
            roles: item.roles
        };
    };
}
