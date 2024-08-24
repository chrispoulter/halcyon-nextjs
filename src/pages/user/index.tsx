import { useState } from 'react';
import { UserSort } from '@/features/user/userTypes';
import { useSearchUsersQuery } from '@/features/user/userEndpoints';
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

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getRunningQueriesThunk } from '@/redux/api';
import { searchUsers } from '@/features/user/userEndpoints';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const defaultRequest = {
    search: '',
    sort: UserSort.NAME_ASC,
    page: 1,
    size: 5
};

const UsersPage = () => {
    const [request, setRequest] = useState(defaultRequest);

    const {
        data: users,
        isLoading,
        isFetching,
        error
    } = useSearchUsersQuery(request);

    const loadingOrError = isLoading || !!error;

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
                        isLoading={loadingOrError || isFetching}
                    />
                    <SortUserDropdown
                        selected={request.sort}
                        onSelect={onSort}
                        isLoading={loadingOrError || isFetching}
                    />
                </div>

                <ButtonGroup className="mb-3">
                    <ButtonLink href="/user/create" variant="primary">
                        Create New
                    </ButtonLink>
                </ButtonGroup>

                <UserList isLoading={loadingOrError} users={users?.items} />

                <Pager
                    isLoading={loadingOrError}
                    isFetching={isFetching}
                    hasNextPage={users?.hasNextPage}
                    hasPreviousPage={users?.hasPreviousPage}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps(store => async ({ req, res }) => {
        const session = await getServerSession(req, res, authOptions);

        store.dispatch(searchUsers.initiate(defaultRequest));

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default UsersPage;
