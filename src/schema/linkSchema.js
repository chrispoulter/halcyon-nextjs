const { gql } = require('apollo-server');

module.exports = gql`
    scalar DateTime

    type MutationResponse {
        message: String
    }

    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }
`;
