import { gql } from 'apollo-server';

export const linkSchema = gql`
    scalar DateTime

    type MutationResponse {
        code: String
        message: String
    }

    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }
`;
