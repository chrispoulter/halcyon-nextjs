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
    searchUsers
} from '@/features/user/hooks/useSearchUsers';
import { UserSort } from '@/features/user/userTypes';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const defaultRequest = {
    search: '',
    sort: UserSort.NAME_ASC,
    page: 1,
    size: 5
};

const UsersPage = () => {
    const [request, setRequest] = useState(defaultRequest);

    const { data, isFetching, isLoading, isError } = useSearchUsers(request);

    const onSubmit = (values: SearchUserFormValues) => {
        setRequest({ ...request, ...values, page: 1 });
        return true;
    };

    const onNextPage = () => setRequest({ ...request, page: request.page + 1 });

    const onPreviousPage = () =>
        setRequest({ ...request, page: request.page - 1 });

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
                        isLoading={isLoading || isError || isFetching}
                    />
                    <SortUserDropdown
                        selected={request.sort}
                        onSelect={onSort}
                        isLoading={isLoading || isError || isFetching}
                    />
                </div>

                <ButtonGroup className="mb-3">
                    <ButtonLink href="/user/create" variant="primary">
                        Create New
                    </ButtonLink>
                </ButtonGroup>

                <UserList
                    isLoading={isLoading || isError}
                    users={data?.items}
                />

                <Pager
                    isLoading={isLoading || isError}
                    isFetching={isFetching}
                    hasNextPage={data?.hasNextPage}
                    hasPreviousPage={data?.hasPreviousPage}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['users', defaultRequest],
        queryFn: () =>
            searchUsers(defaultRequest, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            })
    });

    return {
        props: {
            session,
            dehydratedState: dehydrate(queryClient)
        }
    };
};

export default UsersPage;
