import { gql } from 'apollo-boost';

export const UPDATE_USER = gql`
    mutation UpdateUser(
        $id: ID!
        $emailAddress: String!
        $firstName: String!
        $lastName: String!
        $dateOfBirth: DateTime!
        $roles: [UserRole!]
    ) {
        updateUser(
            id: $id
            input: {
                emailAddress: $emailAddress
                firstName: $firstName
                lastName: $lastName
                dateOfBirth: $dateOfBirth
                roles: $roles
            }
        ) {
            code
            message
            user {
                id
                emailAddress
                firstName
                lastName
                dateOfBirth
                roles
            }
        }
    }
`;
