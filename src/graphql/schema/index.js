const { gql } = require('apollo-server');

const accountSchema = require('./accountSchema');
const manageSchema = require('./manageSchema');
const seedSchema = require('./seedSchema');
const tokenSchema = require('./tokenSchema');
const userSchema = require('./userSchema');

const linkSchema = gql`
    type MutationResponse {
        code: String!
        success: Boolean!
        message: String
    }

    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
    type Subscription {
        _: Boolean
    }
`;

module.exports = [
    linkSchema,
    userSchema,
    accountSchema,
    manageSchema,
    seedSchema,
    tokenSchema
];
