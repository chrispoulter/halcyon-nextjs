import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { UserSort } from '@/features/user/userTypes';
import {
    searchUsers,
    useSearchUsersQuery
} from '@/features/user/userEndpoints';
import { getRunningQueriesThunk } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
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

const params = {
    search: '',
    sort: UserSort.NAME_ASC,
    page: 1,
    size: 5
};

const UsersPage = () => {
    const { data: session, status } = useSession();

    const [state, setState] = useState(params);

    const {
        data: users,
        isLoading,
        isFetching,
        error
    } = useSearchUsersQuery(
        { params: state, accessToken: session?.accessToken },
        { skip: status === 'loading' }
    );

    const loadingOrError = isLoading || !!error;

    const onSubmit = (values: SearchUserFormValues) => {
        setState({ ...state, ...values, page: 1 });
        return true;
    };

    const onNextPage = () => setState({ ...state, page: state.page + 1 });

    const onPreviousPage = () => setState({ ...state, page: state.page - 1 });

    const onSort = (sort: UserSort) => setState({ ...state, sort });

    return (
        <>
            <Meta title="Users" />

            <Container>
                <Title>Users</Title>

                <div className="mb-3 flex gap-1">
                    <SearchUserForm
                        values={state}
                        onSubmit={onSubmit}
                        isLoading={loadingOrError || isFetching}
                    />
                    <SortUserDropdown
                        selected={state.sort}
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

         const accessToken = session?.accessToken || null;

        store.dispatch(
            searchUsers.initiate({
                params,
                accessToken
            })
        );

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default UsersPage;
