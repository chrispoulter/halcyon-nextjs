import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
        variables: state
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
            <div className="d-flex justify-content-between mb-3">
                <h1>{t('ui:Pages:User:Title')}</h1>
                <Button
                    to="/user/create"
                    color="primary"
                    className="align-self-start"
                    tag={Link}
                >
                    {t('ui:Pages:User:CreateNewButton')}
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
                                        'ui:Pages:User:Form:SearchPlaceholder'
                                    )}
                                    value={values.search}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button type="submit" color="secondary">
                                        {t('ui:Pages:User:Form:SearchButton')}
                                    </Button>
                                    <UncontrolledDropdown>
                                        <DropdownToggle caret color="secondary">
                                            {t(
                                                'ui:Pages:User:Form:SortByButton'
                                            )}{' '}
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
                                                        `ui:Pages:User:Form:SortOptions:${option}`
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
                    {t('ui:Pages:User:UsersNotFound')}
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
                                        {t('ui:Pages:User:LockedBadge')}
                                    </Badge>
                                )}
                                {user.roles.map(role => (
                                    <Badge
                                        key={role}
                                        color="primary"
                                        className="mr-1"
                                    >
                                        {t(`ui:Pages:User:Roles:${role}`)}
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
