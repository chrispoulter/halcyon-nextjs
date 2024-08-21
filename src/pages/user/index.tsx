import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { Pager } from '@/components/Pager/Pager';
import {
    SearchUserForm,
    SearchUserFormValues
} from '@/features/user/SearchUserForm/SearchUserForm';
import { SortUserDropdown } from '@/features/user/SortUserDropdown/SortUserDropdown';
import { UserList } from '@/features/user/UserList/UserList';
import {
    useSearchUsers,
    UserSort,
    searchUsers
} from '@/features/user/hooks/useSearchUsers';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const PAGE_SIZE = 5;

const UsersPage = () => {
    const [request, setRequest] = useState({
        search: '',
        sort: UserSort.NAME_ASC,
        page: 1,
        size: PAGE_SIZE
    });

    const { users, isLoading, isFetching, hasMore, loadMore } =
        useSearchUsers(request);

    const onSubmit = (values: SearchUserFormValues) => {
        setRequest({ ...request, ...values });
        return true;
    };

    const onLoadMore = () => loadMore();

    const onSort = (sort: UserSort) => setRequest({ ...request, sort });

    return (
        <>
            <Meta title="Users" />

            <Container>
                <Title>Users</Title>

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
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    const queryClient = new QueryClient();

    const request = {
        search: '',
        sort: UserSort.NAME_ASC
    };

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['users', request],
        initialPageParam: [],
        queryFn: ({ pageParam = 1 }) =>
            searchUsers(
                { ...request, page: pageParam as number, size: PAGE_SIZE },
                {
                    headers: {
                        cookie: req.headers.cookie!
                    }
                }
            )
    });

    // next ssr hack!
    queryClient.setQueryData(['users', request], (data: any) => ({
        ...data,
        pageParams: []
    }));

    return {
        props: {
            session,
            dehydratedState: dehydrate(queryClient)
        }
    };
};

export default UsersPage;
