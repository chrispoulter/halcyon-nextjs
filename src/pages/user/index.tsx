import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { mixed, number, object, string } from 'yup';
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

const PAGE_SIZE = 5;

const schema = object().shape({
    search: string().default(''),
    sort: mixed<UserSort>()
        .oneOf(Object.values(UserSort))
        .default(UserSort.NAME_ASC),
    page: number().positive().integer().default(1)
});

const defaultRequest = schema.getDefault();

const parseQuery = (query: ParsedUrlQuery) => {
    try {
        return {
            ...defaultRequest,
            ...schema.validateSync(query, { stripUnknown: true })
        };
    } catch {
        return defaultRequest;
    }
};

const UsersPage = () => {
    const router = useRouter();

    const request = parseQuery(router.query);

    const {
        data: users,
        isLoading,
        isFetching,
        error
    } = useSearchUsersQuery(
        { ...request, size: PAGE_SIZE },
        { skip: !router.isReady }
    );

    const onSubmit = (values: SearchUserFormValues) =>
        router.push({
            query: { ...request, ...values, page: 1 }
        });

    const onNextPage = () =>
        router.push({
            query: { ...request, page: request.page + 1 }
        });

    const onPreviousPage = () =>
        router.push({
            query: { ...request, page: request.page - 1 }
        });

    const onSort = (sort: UserSort) =>
        router.push({
            query: { ...request, sort }
        });

    const loadingOrError = isLoading || !!error;

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
    wrapper.getServerSideProps(store => async ({ req, res, query }) => {
        const session = await getServerSession(req, res, authOptions);

        const request = parseQuery(query);

        store.dispatch(searchUsers.initiate({ ...request, size: PAGE_SIZE }));

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default UsersPage;
