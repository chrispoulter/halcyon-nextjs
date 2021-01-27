import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
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
                {t('Pages:UpdateUser:UserNotFound')}
            </Alert>
        );
    }

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('Pages:UpdateUser:Form:EmailAddress'))
            .max(254, t('Validation:Max'))
            .email(t('Validation:Email'))
            .required(t('Validation:Required')),
        firstName: Yup.string()
            .label(t('Pages:UpdateUser:Form:FirstName'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        lastName: Yup.string()
            .label(t('Pages:UpdateUser:Form:LastName'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        dateOfBirth: Yup.string()
            .label(t('Pages:UpdateUser:Form:DateOfBirth'))
            .required(t('Validation:Required'))
    });

    const onSubmit = async variables => {
        try {
            const result = await updateUser({
                variables: { id: match.params.id, ...variables }
            });

            toast.success(t(`Api:Codes:${result.data.updateUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    const onLockUser = async () => {
        const confirmed = await confirm({
            title: t('Pages:UpdateUser:LockModal:Title'),
            message: (
                <Trans
                    i18nKey="Pages:UpdateUser:LockModal:Message"
                    values={data.getUserById}
                />
            ),
            confirmText: t('Pages:UpdateUser:LockModal:Confirm'),
            cancelText: t('Pages:UpdateUser:LockModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await lockUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`Api:Codes:${result.data.lockUser.code}`));
        } catch (error) {
            console.error(error);
        }
    };

    const onUnlockUser = async () => {
        const confirmed = await confirm({
            title: t('Pages:UpdateUser:UnlockModal:Title'),
            message: (
                <Trans
                    i18nKey="Pages:UpdateUser:UnlockModal:Message"
                    values={data.getUserById}
                />
            ),
            confirmText: t('Pages:UpdateUser:UnlockModal:Confirm'),
            cancelText: t('Pages:UpdateUser:UnlockModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await unlockUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`Api:Codes:${result.data.unlockUser.code}`));
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteUser = async () => {
        const confirmed = await confirm({
            title: t('Pages:UpdateUser:DeleteModal:Title'),
            message: (
                <Trans
                    i18nKey="Pages:UpdateUser:DeleteModal:Message"
                    values={data.getUserById}
                />
            ),
            confirmText: t('Pages:UpdateUser:DeleteModal:Confirm'),
            cancelText: t('Pages:UpdateUser:DeleteModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await deleteUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`Api:Codes:${result.data.deleteUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>
                {t('Pages:UpdateUser:Title')}
                <br />
                <small className="text-muted">
                    {t('Pages:UpdateUser:Subtitle')}
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
                            label={t('Pages:UpdateUser:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('Pages:UpdateUser:Form:FirstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('Pages:UpdateUser:Form:LastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('Pages:UpdateUser:Form:DateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <Field
                            name="roles"
                            label={t('Pages:UpdateUser:Form:Roles')}
                            options={AVAILABLE_ROLES.map(role => ({
                                value: role,
                                label: t(`Api:UserRoles:${role}`)
                            }))}
                            component={CheckboxGroupInput}
                        />

                        <FormGroup className="text-right">
                            <Button to="/user" className="mr-1" tag={Link}>
                                {t('Pages:UpdateUser:CancelButton')}
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
                                    {t('Pages:UpdateUser:UnlockButton')}
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
                                    {t('Pages:UpdateUser:LockButton')}
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
                                {t('Pages:UpdateUser:DeleteButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                                disabled={
                                    isLocking || isUnlocking || isDeleting
                                }
                            >
                                {t('Pages:UpdateUser:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
