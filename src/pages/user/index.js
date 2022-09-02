import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { Button, Spinner, Pager, Meta } from '../../components';
import { useSearchUsersQuery } from '../../redux';
import { ROLE_OPTIONS, USER_ADMINISTRATOR_ROLES } from '../../utils/auth';

const SORT_OPTIONS = {
    NAME_ASC: 'Name A-Z',
    NAME_DESC: 'Name Z-A',
    EMAIL_ADDRESS_ASC: 'Email Address A-Z',
    EMAIL_ADDRESS_DESC: 'Email Address Z-A'
};

const UserPage = () => {
    const router = useRouter();

    const { page, size, search, sort } = router.query;

    const filter = {
        page: parseInt(page || '1'),
        size: parseInt(size || '10'),
        search: search || '',
        sort: sort || 'NAME_ASC'
    };

    const { isFetching, data: users } = useSearchUsersQuery(filter, {
        skip: !router.isReady
    });

    if (isFetching || !router.isReady) {
        return <Spinner />;
    }

    const onSort = value =>
        router.push({ pathname: '/user', query: { ...filter, sort: value } });

    const onPreviousPage = () =>
        router.push({
            pathname: '/user',
            query: { ...filter, page: filter.page - 1 }
        });

    const onNextPage = () =>
        router.push({
            pathname: '/user',
            query: { ...filter, page: filter.page + 1 }
        });

    const onSubmit = values =>
        router.push({
            pathname: '/user',
            query: { ...filter, page: 1, search: values.search }
        });

    return (
        <Container>
            <Meta title="Users" />

            <div className="d-flex justify-content-between mb-3">
                <h1>Users</h1>
                <Link href="/user/create" passHref>
                    <Button variant="primary" className="align-self-start">
                        Create New
                    </Button>
                </Link>
            </div>
            <hr />

            <Formik
                onSubmit={onSubmit}
                initialValues={{ search: filter.search }}
            >
                {({ handleChange, handleBlur, values }) => (
                    <Form>
                        <InputGroup className="mb-3">
                            <FormControl
                                name="search"
                                type="text"
                                placeholder="Search..."
                                value={values.search}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                            <DropdownButton
                                title="Sort By"
                                variant="secondary"
                                align="end"
                            >
                                {Object.entries(SORT_OPTIONS).map(
                                    ([value, label]) => (
                                        <Dropdown.Item
                                            key={value}
                                            active={value === filter.sort}
                                            onClick={() => onSort(value)}
                                        >
                                            {label}
                                        </Dropdown.Item>
                                    )
                                )}
                            </DropdownButton>
                        </InputGroup>
                    </Form>
                )}
            </Formik>

            {!users?.data?.items.length ? (
                <Alert variant="info">No users could be found.</Alert>
            ) : (
                <>
                    {users.data.items.map(user => (
                        <Link key={user.id} href={`/user/${user.id}`} passHref>
                            <Card
                                body
                                className="text-decoration-none mb-2"
                                as="a"
                            >
                                <h5>
                                    {user.firstName} {user.lastName}
                                    <br />
                                    <small className="text-muted">
                                        {user.emailAddress}
                                    </small>
                                </h5>
                                <div>
                                    {user.isLockedOut && (
                                        <Badge bg="danger" className="me-1">
                                            Locked
                                        </Badge>
                                    )}
                                    {user.roles?.map(role => (
                                        <Badge
                                            key={role}
                                            bg="primary"
                                            className="me-1"
                                        >
                                            {ROLE_OPTIONS[role]}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        </Link>
                    ))}

                    <Pager
                        hasNextPage={users.data.hasNextPage}
                        hasPreviousPage={users.data.hasPreviousPage}
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                    />
                </>
            )}
        </Container>
    );
};

UserPage.auth = true;
UserPage.requiredRoles = USER_ADMINISTRATOR_ROLES;

export default UserPage;
