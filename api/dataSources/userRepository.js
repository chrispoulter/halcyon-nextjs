import AWS from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: config.DYNAMODB_REGION,
    endpoint: config.DYNAMODB_ENDPOINT
});

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
            IndexName: 'emailAddress-index',
            ExpressionAttributeNames: { '#emailAddress': 'emailAddress' },
            ExpressionAttributeValues: { ':emailAddress': emailAddress },
            KeyConditionExpression: '#emailAddress = :emailAddress'
        };

        const result = await dynamoDb.query(params).promise();

        return this._map(result.Items[0]);
    }

    async create(user) {
        const params = {
            TableName: config.DYNAMODB_USERS,
            Item: {
                id: uuidv4(),
                ...user
            }
        };

        const result = await dynamoDb.put(params).promise();

        return this._map(result.Item);
    }

    async update(user) {
        const params = {
            TableName: config.DYNAMODB_USERS,
            Key: {
                id: user.id
            },
            ExpressionAttributeNames: {
                '#emailAddress': 'emailAddress',
                '#password': 'password',
                '#firstName': 'firstName',
                '#lastName': 'lastName',
                '#dateOfBirth': 'dateOfBirth',
                '#isLockedOut': 'isLockedOut',
                '#passwordResetToken': 'passwordResetToken',
                '#roles': 'roles'
            },
            ExpressionAttributeValues: {
                ':emailAddress': user.emailAddress,
                ':password': user.password || '',
                ':firstName': user.firstName,
                ':lastName': user.lastName,
                ':dateOfBirth': user.dateOfBirth,
                ':isLockedOut': user.isLockedOut,
                ':passwordResetToken': user.passwordResetToken || '',
                ':roles': user.roles
            },
            UpdateExpression:
                'SET #emailAddress = :emailAddress, #password = :password, #firstName = :firstName, #lastName = :lastName, #dateOfBirth = :dateOfBirth, #isLockedOut = :isLockedOut, #passwordResetToken = :passwordResetToken, #roles = :roles',
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDb.update(params).promise();

        return this._map(result.Attributes);
    }

    async remove(user) {
        const params = {
            TableName: config.DYNAMODB_USERS,
            Key: { id: user.id }
        };

        const result = await dynamoDb.delete(params).promise();

        return this._map(result.Item);
    }

    async upsert(user) {
        const existing = await this.getByEmailAddress(user.emailAddress);

        return existing
            ? this.update({ ...existing, ...user })
            : this.create(user);
    }

    async search(request) {
        const params = {
            TableName: config.DYNAMODB_USERS
        };

        const result = await dynamoDb.scan(params).promise();

        return {
            items: result.Items.map(this._map)
        };
    }

    _map = user => user;
}
