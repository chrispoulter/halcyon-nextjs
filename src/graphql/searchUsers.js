import { gql } from 'apollo-boost';

export const SEARCH_USERS = gql`
    query SearchUsers(
        $page: Int
        $size: Int
        $search: String
        $sort: UserSortExpression
    ) {
        searchUsers(
            input: { page: $page, size: $size, search: $search, sort: $sort }
        ) {
            items {
                id
                emailAddress
                firstName
                lastName
                dateOfBirth
                isLockedOut
                roles
            }
            hasNextPage
            hasPreviousPage
        }
    }
`;
