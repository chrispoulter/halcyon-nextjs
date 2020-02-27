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
        emailAddress: String
        password: String
    }

    type TokenMutationResponse {
        code: String!
        success: Boolean!
        message: String
        isLockedOut: Boolean
        token: Token
    }

    extend type Mutation {
        generateToken(input: TokenInput): TokenMutationResponse
    }
`;
