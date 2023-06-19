import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { UserSort } from '@/models/user.types';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Pager } from '@/components/Pager/Pager';
import {
    SearchUserForm,
    SearchUserFormValues
} from '@/features/user/SearchUserForm/SearchUserForm';
import { SortUserDropdown } from '@/features/user/SortUserDropdown/SortUserDropdown';
import { UserList } from '@/features/user/UserList/UserList';
import { searchUsers, useSearchUsers } from '@/hooks/useSearchUsers';
import { isUserAdministrator } from '@/utils/auth';
import { getBaseUrl } from '@/utils/url';

const Users = () => {
    const [request, setRequest] = useState({
        search: '',
        sort: UserSort.NAME_ASC
    });

    const { users, isLoading, isFetching, loadMore, hasMore } =
        useSearchUsers(request);

    const onSubmit = (values: SearchUserFormValues) => {
        setRequest({ ...request, ...values });
        return true;
    };

    const onLoadMore = () => loadMore();

    const onSort = (sort: UserSort) => setRequest({ ...request, sort });

    return (
        <Container>
            <PageTitle>Users</PageTitle>

            <div className="mb-3 flex gap-1">
                <SearchUserForm
                    values={request}
                    onSubmit={onSubmit}
                    isLoading={isLoading || isFetching}
                />
                <SortUserDropdown
                    selected={request.sort}
                    onSelect={onSort}
                    isLoading={isLoading || isFetching}
                />
            </div>

            <ButtonGroup className="mb-3">
                <ButtonLink href="/user/create" variant="primary">
                    Create New
                </ButtonLink>
            </ButtonGroup>

            <UserList isLoading={isLoading} users={users} />

            <Pager
                isLoading={isLoading}
                isFetching={isFetching}
                hasMore={hasMore}
                onLoadMore={onLoadMore}
            />
        </Container>
    );
};

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//     const session = await getServerSession(req, res, authOptions);

//     const queryClient = new QueryClient();

//     const baseUrl = getBaseUrl(req);

//     const request = {
//         search: '',
//         sort: UserSort.NAME_ASC
//     };

//     await queryClient.prefetchInfiniteQuery(
//         ['users', request],
//         ({ pageParam = 1 }) =>
//             searchUsers(
//                 { ...request, page: pageParam, size: 5 },
//                 {
//                     headers: {
//                         cookie: req.headers.cookie!
//                     }
//                 },
//                 baseUrl
//             )
//     );

//     // next ssr hack!
//     queryClient.setQueryData(['users', request], (data: any) => ({
//         ...data,
//         pageParams: []
//     }));

//     return {
//         props: {
//             session,
//             dehydratedState: dehydrate(queryClient)
//         }
//     };
// };

Users.meta = {
    title: 'Users'
};

Users.auth = isUserAdministrator;

export default Users;
