import { useState } from 'react';
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
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { isUserAdministrator } from '@/utils/auth';

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
                    initialValues={request}
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
                hasMore={hasMore}
                onLoadMore={onLoadMore}
            />
        </Container>
    );
};

Users.meta = {
    title: 'Users'
};

Users.auth = isUserAdministrator;

export default Users;
