import { gql } from 'apollo-boost';

export const DELETE_ACCOUNT = gql`
    mutation DeleteAccount {
        deleteAccount {
            code
            message
            user {
                id
            }
        }
    }
`;
