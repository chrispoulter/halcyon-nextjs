import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Alert, FormGroup } from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { toast } from 'react-toastify';
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
    Button
} from '../components';
import { AVAILABLE_ROLES } from '../utils/auth';

export const UpdateUserPage = ({ history, match }) => {
    const { t } = useTranslation();

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
            <Alert color="info" className="container p-3 mb-3">
                {t('ui:Pages:UpdateUser:UserNotFound')}
            </Alert>
        );
    }

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('ui:Pages:UpdateUser:Form:EmailAddress'))
            .max(254, t('ui:Validation:Max'))
            .email(t('ui:Validation:Email'))
            .required(t('ui:Validation:Required')),
        firstName: Yup.string()
            .label(t('ui:Pages:UpdateUser:Form:FirstName'))
            .max(50, t('ui:Validation:Max'))
            .required(t('ui:Validation:Required')),
        lastName: Yup.string()
            .label(t('ui:Pages:UpdateUser:Form:LastName'))
            .max(50, t('ui:Validation:Max'))
            .required(t('ui:Validation:Required')),
        dateOfBirth: Yup.string()
            .label(t('ui:Pages:UpdateUser:Form:DateOfBirth'))
            .required(t('ui:Validation:Required'))
    });

    const onSubmit = async variables => {
        try {
            const result = await updateUser({
                variables: { id: match.params.id, ...variables }
            });

            toast.success(t(`api:Codes:${result.data.updateUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    const onLockUser = async () => {
        const confirmed = await confirm({
            title: t('ui:Pages:UpdateUser:LockModal:Title'),
            message: t(
                'ui:Pages:UpdateUser:LockModal:Message',
                data.getUserById
            ),
            confirmText: t('ui:Pages:UpdateUser:LockModal:Confirm'),
            cancelText: t('ui:Pages:UpdateUser:LockModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await lockUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`api:Codes:${result.data.lockUser.code}`));
        } catch (error) {
            console.error(error);
        }
    };

    const onUnlockUser = async () => {
        const confirmed = await confirm({
            title: t('ui:Pages:UpdateUser:UnlockModal:Title'),
            message: t(
                'ui:Pages:UpdateUser:UnlockModal:Message',
                data.getUserById
            ),
            confirmText: t('ui:Pages:UpdateUser:UnlockModal:Confirm'),
            cancelText: t('ui:Pages:UpdateUser:UnlockModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await unlockUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`api:Codes:${result.data.unlockUser.code}`));
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteUser = async () => {
        const confirmed = await confirm({
            title: t('ui:Pages:UpdateUser:DeleteModal:Title'),
            message: t(
                'ui:Pages:UpdateUser:DeleteModal:Message',
                data.getUserById
            ),
            confirmText: t('ui:Pages:UpdateUser:DeleteModal:Confirm'),
            cancelText: t('ui:Pages:UpdateUser:DeleteModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await deleteUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`api:Codes:${result.data.deleteUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>
                {t('ui:Pages:UpdateUser:Title')}
                <br />
                <small className="text-muted">
                    {t('ui:Pages:UpdateUser:Subtitle')}
                </small>
            </h1>
            <hr />

            <Formik
                enableReinitialize={true}
                initialValues={data.getUserById}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <Field
                            name="emailAddress"
                            type="email"
                            label={t('ui:Pages:UpdateUser:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('ui:Pages:UpdateUser:Form:FirstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('ui:Pages:UpdateUser:Form:LastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('ui:Pages:UpdateUser:Form:DateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <Field
                            name="roles"
                            label={t('ui:Pages:UpdateUser:Form:Roles')}
                            options={AVAILABLE_ROLES.map(role => ({
                                value: role,
                                label: t(`api:Roles:${role}`)
                            }))}
                            component={CheckboxGroupInput}
                        />

                        <FormGroup className="text-right">
                            <Button to="/user" className="mr-1" tag={Link}>
                                {t('ui:Pages:UpdateUser:CancelButton')}
                            </Button>
                            {data.getUserById.isLockedOut ? (
                                <Button
                                    color="warning"
                                    className="mr-1"
                                    loading={isUnlocking}
                                    disabled={
                                        isLocking || isDeleting || isSubmitting
                                    }
                                    onClick={onUnlockUser}
                                >
                                    {t('ui:Pages:UpdateUser:UnlockButton')}
                                </Button>
                            ) : (
                                <Button
                                    color="warning"
                                    className="mr-1"
                                    loading={isLocking}
                                    disabled={
                                        isUnlocking ||
                                        isDeleting ||
                                        isSubmitting
                                    }
                                    onClick={onLockUser}
                                >
                                    {t('ui:Pages:UpdateUser:LockButton')}
                                </Button>
                            )}
                            <Button
                                color="danger"
                                className="mr-1"
                                loading={isDeleting}
                                disabled={
                                    isLocking || isUnlocking || isSubmitting
                                }
                                onClick={onDeleteUser}
                            >
                                {t('ui:Pages:UpdateUser:DeleteButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                                disabled={
                                    isLocking || isUnlocking || isDeleting
                                }
                            >
                                {t('ui:Pages:UpdateUser:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
