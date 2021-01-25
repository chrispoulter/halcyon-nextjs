const { gql } = require('apollo-server');

export const seedSchema = gql`
    extend type Mutation {
        seedData: MutationResponse
    }
`;
