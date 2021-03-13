import { gql } from 'apollo-server';

export const userSchema = gql`
    enum UserSortExpression {
        NAME_ASC
        NAME_DESC
        EMAIL_ADDRESS_ASC
        EMAIL_ADDRESS_DESC
    }

    enum UserRole {
        SYSTEM_ADMINISTRATOR
        USER_ADMINISTRATOR
    }

    type User {
        id: ID!
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: DateTime!
        isLockedOut: Boolean
        roles: [UserRole!]
    }

    type UserSearchResult {
        items: [User!]
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
        dateOfBirth: DateTime!
        roles: [UserRole!]
    }

    input UpdateUserInput {
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: DateTime!
        roles: [UserRole!]
    }

    type UserMutationResponse {
        code: String
        message: String
        user: User
    }

    extend type Query {
        searchUsers(input: SearchUserInput): UserSearchResult
        getUserById(id: ID!): User
    }

    extend type Mutation {
        createUser(input: CreateUserInput!): UserMutationResponse
        updateUser(id: ID!, input: UpdateUserInput!): UserMutationResponse
        lockUser(id: ID!): UserMutationResponse
        unlockUser(id: ID!): UserMutationResponse
        deleteUser(id: ID!): UserMutationResponse
    }
`;
