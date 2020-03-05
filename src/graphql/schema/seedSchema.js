const { gql } = require('apollo-server');

module.exports = gql`
    extend type Mutation {
        seedData: Boolean
    }
`;
