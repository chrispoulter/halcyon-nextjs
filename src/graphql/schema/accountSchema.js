const { gql } = require('apollo-server');

module.exports = gql`
    input RegisterInput {
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
        dateOfBirth: String!
    }

    extend type Mutation {
        register(input: RegisterInput): UserMutationResponse
        forgotPassword(emailAddress: String!): MutationResponse
        resetPassword(
            token: String!
            emailAddress: String!
            newPassword: String!
        ): UserMutationResponse
    }
`;
