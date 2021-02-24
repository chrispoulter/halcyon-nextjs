import { gql } from 'apollo-server';

export const accountSchema = gql`
    input RegisterInput {
        emailAddress: String!
        password: String!
        firstName: String!
        lastName: String!
        dateOfBirth: DateTime!
    }

    input ResetPasswordInput {
        token: String!
        emailAddress: String!
        newPassword: String!
    }

    extend type Mutation {
        register(input: RegisterInput!): UserMutationResponse
        forgotPassword(emailAddress: String!): MutationResponse
        resetPassword(input: ResetPasswordInput!): UserMutationResponse
    }
`;
