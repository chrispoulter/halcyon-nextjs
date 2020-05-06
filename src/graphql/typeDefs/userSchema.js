const { gql } = require('apollo-server');

module.exports = gql`
    enum UserSortExpression {
        NAME_ASC
        NAME_DESC
        EMAIL_ADDRESS_ASC
        EMAIL_ADDRESS_DESC
    }

    type User {
        id: ID!
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: Date!
        isLockedOut: Boolean
        roles: [String]
    }

    type UserSearchResult {
        items: [User]
        before: String
        after: String
    }

    input SearchUserInput {
        size: Int
        search: String
        sort: UserSortExpression
        cursor: String
    }

    input CreateUserInput {
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
        dateOfBirth: Date!
        roles: [String]
    }

    input UpdateUserInput {
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: Date!
        roles: [String]
    }

    type UserMutationResponse {
        message: String
        code: String
        user: User
    }

    type UserSubscriptionResponse {
        code: String
        user: User
    }

    extend type Query {
        searchUsers(input: SearchUserInput): UserSearchResult
        getUserById(id: ID!): User
    }

    extend type Mutation {
        createUser(input: CreateUserInput): UserMutationResponse
        updateUser(id: ID!, input: UpdateUserInput): UserMutationResponse
        lockUser(id: ID!): UserMutationResponse
        unlockUser(id: ID!): UserMutationResponse
        deleteUser(id: ID!): UserMutationResponse
    }

    extend type Subscription {
        userUpdated: UserSubscriptionResponse
    }
`;
