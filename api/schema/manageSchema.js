import { gql } from 'apollo-server';

export const manageSchema = gql`
    input UpdateProfileInput {
        emailAddress: String!
        firstName: String!
        lastName: String!
        dateOfBirth: DateTime!
    }

    input ChangePasswordInput {
        currentPassword: String!
        newPassword: String!
    }

    extend type Query {
        getProfile: User
    }

    extend type Mutation {
        updateProfile(input: UpdateProfileInput!): UserMutationResponse
        changePassword(input: ChangePasswordInput!): UserMutationResponse
        deleteAccount: UserMutationResponse
    }
`;
