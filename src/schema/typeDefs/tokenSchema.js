const { gql } = require('apollo-server');

module.exports = gql`
    enum GrantType {
        PASSWORD
    }

    type Token {
        accessToken: String!
        expiresIn: Int!
    }

    input TokenInput {
        grantType: GrantType!
        emailAddress: String!
        password: String!
    }

    extend type Mutation {
        generateToken(input: TokenInput!): Token
    }
`;
