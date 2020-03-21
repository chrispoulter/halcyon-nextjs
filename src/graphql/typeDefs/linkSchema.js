const { gql } = require('apollo-server');

module.exports = gql`
    scalar Date

    type MutationResponse {
        message: String
        code: String
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
