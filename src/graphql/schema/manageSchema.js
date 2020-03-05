const { gql } = require('apollo-server');

module.exports = gql`
    input UpdateProfileInput {
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: Date!
    }

    extend type Query {
        getProfile: User
    }

    extend type Mutation {
        updateProfile(input: UpdateProfileInput): User
        changePassword(currentPassword: String!, newPassword: String!): User
        deleteAccount: Boolean
    }
`;
