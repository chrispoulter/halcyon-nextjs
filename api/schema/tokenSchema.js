const { gql } = require('apollo-server');

export const tokenSchema = gql`
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
