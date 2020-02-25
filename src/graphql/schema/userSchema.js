const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        id: ID!
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: String!
        isLockedOut: Boolean
        picture: String
        roles: [String]
    }

    input CreateUserInput {
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
        dateOfBirth: String!
        roles: [String]
    }

    input UpdateUserInput {
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: String!
        roles: [String]
    }

    type UserMutationResponse {
        code: String!
        success: Boolean!
        message: String
        user: User
    }

    extend type Query {
        users: [User]
        getUserById(id: ID!): User
    }

    extend type Mutation {
        createUser(input: CreateUserInput): UserMutationResponse
        updateUser(id: ID!, input: UpdateUserInput): UserMutationResponse
        lockUser(id: ID!): UserMutationResponse
        unlockUser(id: ID!): UserMutationResponse
        deleteUser(id: ID!): MutationResponse
    }
`;
