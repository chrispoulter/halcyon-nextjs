const { gql } = require('apollo-server');

module.exports = gql`
    enum UserSortExpression {
        EMAIL_ADDRESS
        EMAIL_ADDRESS_DESC
        DISPLAY_NAME
        DISPLAY_NAME_DESC
    }

    type User {
        id: ID!
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: Date!
        isLockedOut: Boolean
        picture: String
        roles: [String]
    }

    type UserSearchResult {
        items: [User]
        page: Int!
        size: Int!
        totalPages: Int!
        totalCount: Int!
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        search: String
        sort: UserSortExpression
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

    extend type Query {
        searchUsers(
            page: Int
            size: Int
            search: String
            sort: UserSortExpression
        ): UserSearchResult
        getUserById(id: ID!): User
    }

    extend type Mutation {
        createUser(input: CreateUserInput): User
        updateUser(id: ID!, input: UpdateUserInput): User
        lockUser(id: ID!): User
        unlockUser(id: ID!): User
        deleteUser(id: ID!): Boolean
    }
`;
