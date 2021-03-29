import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/react-hooks';
import { Formik, Form } from 'formik';
import {
    Container,
    Button,
    FormGroup,
    InputGroup,
    Input,
    InputGroupAddon,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Alert,
    Card,
    Badge
} from 'reactstrap';
import { SEARCH_USERS } from '../graphql';
import { Spinner, Pager } from '../components';

const sortOptions = [
    'NAME_ASC',
    'NAME_DESC',
    'EMAIL_ADDRESS_ASC',
    'EMAIL_ADDRESS_DESC'
];

export const UserPage = () => {
    const { t } = useTranslation();

    const [state, setState] = useState({
        size: 10,
        search: '',
        sort: sortOptions[0],
        cursor: undefined
    });

    const { loading, data } = useQuery(SEARCH_USERS, {
        variables: state,
        fetchPolicy: 'no-cache'
    });

    if (loading) {
        return <Spinner />;
    }

    const onSort = value =>
        setState({ ...state, cursor: undefined, sort: value });

    const onPreviousPage = () =>
        setState({ ...state, cursor: data.searchUsers.before });

    const onNextPage = () =>
        setState({ ...state, cursor: data.searchUsers.after });

    const onSubmit = values =>
        setState({ ...state, cursor: undefined, search: values.search });

    return (
        <Container>
            <Helmet>
                <title>{t('pages.user.meta.title')}</title>
            </Helmet>

            <div className="d-flex justify-content-between mb-3">
                <h1>{t('pages.user.title')}</h1>
                <Button
                    to="/user/create"
                    color="primary"
                    className="align-self-start"
                    tag={Link}
                >
                    {t('pages.user.createNewButton')}
                </Button>
            </div>
            <hr />

            <Formik
                onSubmit={onSubmit}
                initialValues={{ search: state.search }}
            >
                {({ handleChange, handleBlur, values }) => (
                    <Form>
                        <FormGroup>
                            <InputGroup>
                                <Input
                                    name="search"
                                    type="text"
                                    placeholder={t(
                                        'pages.user.form.searchPlaceholder'
                                    )}
                                    value={values.search}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button type="submit" color="secondary">
                                        {t('pages.user.form.searchButton')}
                                    </Button>
                                    <UncontrolledDropdown>
                                        <DropdownToggle caret color="secondary">
                                            {t('pages.user.form.sortByButton')}{' '}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            {sortOptions.map(option => (
                                                <DropdownItem
                                                    key={option}
                                                    active={
                                                        option === state.sort
                                                    }
                                                    onClick={() =>
                                                        onSort(option)
                                                    }
                                                >
                                                    {t(
                                                        `api.userSortExpressions.${option}`
                                                    )}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                )}
            </Formik>

            {!data?.searchUsers.items.length ? (
                <Alert color="info" className="container p-3 mb-3">
                    {t('pages.user.usersNotFound')}
                </Alert>
            ) : (
                <>
                    {data.searchUsers.items?.map(user => (
                        <Card
                            key={user.id}
                            to={`/user/${user.id}`}
                            className="mb-2"
                            body
                            tag={Link}
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
                                    <Badge color="danger" className="mr-1">
                                        {t('pages.user.lockedBadge')}
                                    </Badge>
                                )}
                                {user.roles?.map(role => (
                                    <Badge
                                        key={role}
                                        color="primary"
                                        className="mr-1"
                                    >
                                        {t(`api.userRoles.${role}`)}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    ))}

                    <Pager
                        hasNextPage={!!data.searchUsers.after}
                        hasPreviousPage={!!data.searchUsers.before}
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                    />
                </>
            )}
        </Container>
    );
};
