import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import {
    GET_USER_BY_ID,
    UPDATE_USER,
    LOCK_USER,
    UNLOCK_USER,
    DELETE_USER
} from '../graphql';
import {
    Spinner,
    TextInput,
    DateInput,
    CheckboxGroupInput,
    Button,
    useModal,
    useToast
} from '../components';
import { ALL_ROLES } from '../utils/auth';
import { trackEvent, captureError } from '../utils/logger';

export const UpdateUserPage = ({ history, match }) => {
    const { showModal } = useModal();

    const toast = useToast();

    const { loading, data } = useQuery(GET_USER_BY_ID, {
        variables: { id: match.params.id }
    });

    const [updateUser] = useMutation(UPDATE_USER);

    const [lockUser, { loading: isLocking }] = useMutation(LOCK_USER);

    const [unlockUser, { loading: isUnlocking }] = useMutation(UNLOCK_USER);

    const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER);

    if (loading) {
        return <Spinner />;
    }

    if (!data?.getUserById) {
        return (
            <Container>
                <Alert variant="info">User could not be found.</Alert>
            </Container>
        );
    }

    const onSubmit = async variables => {
        try {
            const result = await updateUser({
                variables: { id: match.params.id, ...variables }
            });

            toast.success(result.data.updateUser.message);

            trackEvent('user_updated', {
                entityId: result.data.updateUser.user.id
            });

            history.push('/user');
        } catch (error) {
            captureError(error);
        }
    };

    const onLockUser = () =>
        showModal({
            title: 'Confirm',
            body: (
                <>
                    Are you sure you want to lock{' '}
                    <strong>
                        {data.getUserById.firstName} {data.getUserById.lastName}
                    </strong>
                    ?
                </>
            ),
            onOpen: () =>
                trackEvent('screen_view', {
                    screen_name: 'lock-user-modal'
                }),
            onOk: async () => {
                try {
                    const result = await lockUser({
                        variables: { id: match.params.id }
                    });

                    toast.success(result.data.lockUser.message);

                    trackEvent('user_locked', {
                        entityId: result.data.lockUser.user.id
                    });
                } catch (error) {
                    captureError(error);
                }
            }
        });

    const onUnlockUser = () =>
        showModal({
            title: 'Confirm',
            body: (
                <>
                    Are you sure you want to unlock{' '}
                    <strong>
                        {data.getUserById.firstName} {data.getUserById.lastName}
                    </strong>
                    ?
                </>
            ),
            onOpen: () =>
                trackEvent('screen_view', {
                    screen_name: 'unlock-user-modal'
                }),
            onOk: async () => {
                try {
                    const result = await unlockUser({
                        variables: { id: match.params.id }
                    });

                    toast.success(result.data.unlockUser.message);

                    trackEvent('user_unlocked', {
                        entityId: result.data.unlockUser.user.id
                    });
                } catch (error) {
                    captureError(error);
                }
            }
        });

    const onDeleteUser = () =>
        showModal({
            title: 'Confirm',
            body: (
                <>
                    Are you sure you want to delete{' '}
                    <strong>
                        {data.getUserById.firstName} {data.getUserById.lastName}
                    </strong>
                    ?
                </>
            ),
            onOpen: () =>
                trackEvent('screen_view', {
                    screen_name: 'delete-user-modal'
                }),
            onOk: async () => {
                try {
                    const result = await deleteUser({
                        variables: { id: match.params.id }
                    });

                    toast.success(result.data.deleteUser.message);

                    trackEvent('user_deleted', {
                        entityId: result.data.deleteUser.user.id
                    });

                    history.push('/user');
                } catch (error) {
                    captureError(error);
                }
            }
        });

    return (
        <Container>
            <Helmet>
                <title>Update User</title>
            </Helmet>

            <h1>
                User
                <br />
                <small className="text-muted">Update</small>
            </h1>
            <hr />

            <Formik
                enableReinitialize={true}
                initialValues={data.getUserById}
                validationSchema={Yup.object().shape({
                    emailAddress: Yup.string()
                        .label('Email Address')
                        .max(254)
                        .email()
                        .required(),
                    firstName: Yup.string()
                        .label('First Name')
                        .max(50)
                        .required(),
                    lastName: Yup.string()
                        .label('Last Name')
                        .max(50)
                        .required(),
                    dateOfBirth: Yup.string().label('Date Of Birth').required()
                })}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <Field
                            name="emailAddress"
                            type="email"
                            label="Email Address"
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label="First Name"
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label="Last Name"
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label="Date Of Birth"
                            required
                            component={DateInput}
                        />

                        <Field
                            name="roles"
                            label="Roles"
                            options={ALL_ROLES}
                            component={CheckboxGroupInput}
                        />

                        <div className="mb-3 text-end">
                            <Button
                                to="/user"
                                as={Link}
                                variant="secondary"
                                className="me-1"
                            >
                                Cancel
                            </Button>
                            {data.getUserById.isLockedOut ? (
                                <Button
                                    variant="warning"
                                    className="me-1"
                                    loading={isUnlocking}
                                    disabled={
                                        isLocking || isDeleting || isSubmitting
                                    }
                                    onClick={onUnlockUser}
                                >
                                    Unlock
                                </Button>
                            ) : (
                                <Button
                                    variant="warning"
                                    className="me-1"
                                    loading={isLocking}
                                    disabled={
                                        isUnlocking ||
                                        isDeleting ||
                                        isSubmitting
                                    }
                                    onClick={onLockUser}
                                >
                                    Lock
                                </Button>
                            )}
                            <Button
                                variant="danger"
                                className="me-1"
                                loading={isDeleting}
                                disabled={
                                    isLocking || isUnlocking || isSubmitting
                                }
                                onClick={onDeleteUser}
                            >
                                Delete
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
                                disabled={
                                    isLocking || isUnlocking || isDeleting
                                }
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
