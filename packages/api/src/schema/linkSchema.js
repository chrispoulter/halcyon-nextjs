const { gql } = require('apollo-server');

export const linkSchema = gql`
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
