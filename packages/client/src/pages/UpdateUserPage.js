import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet';
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
                {t('pages:updateUser.userNotFound')}
            </Alert>
        );
    }

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('pages:updateUser.form.emailAddress'))
            .max(254)
            .email()
            .required(),
        firstName: Yup.string()
            .label(t('pages:updateUser.form.firstName'))
            .max(50)
            .required(),
        lastName: Yup.string()
            .label(t('pages:updateUser.form.lastName'))
            .max(50)
            .required(),
        dateOfBirth: Yup.string()
            .label(t('pages:updateUser.form.dateOfBirth'))
            .required()
    });

    const onSubmit = async variables => {
        try {
            const result = await updateUser({
                variables: { id: match.params.id, ...variables }
            });

            toast.success(t(`api:codes.${result.data.updateUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    const onLockUser = async () => {
        const confirmed = await confirm({
            title: t('pages:updateUser.lockModal.title'),
            message: (
                <Trans
                    i18nKey="pages:updateUser.lockModal.message"
                    values={data.getUserById}
                />
            ),
            confirmText: t('pages:updateUser.lockModal.confirm'),
            cancelText: t('pages:updateUser.lockModal.cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await lockUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`api:codes.${result.data.lockUser.code}`));
        } catch (error) {
            console.error(error);
        }
    };

    const onUnlockUser = async () => {
        const confirmed = await confirm({
            title: t('pages:updateUser.unlockModal.title'),
            message: (
                <Trans
                    i18nKey="pages:updateUser.unlockModal.message"
                    values={data.getUserById}
                />
            ),
            confirmText: t('pages:updateUser.unlockModal.confirm'),
            cancelText: t('pages:updateUser.unlockModal.cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await unlockUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`api:codes.${result.data.unlockUser.code}`));
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteUser = async () => {
        const confirmed = await confirm({
            title: t('pages:updateUser.deleteModal.title'),
            message: (
                <Trans
                    i18nKey="pages:updateUser.deleteModal.message"
                    values={data.getUserById}
                />
            ),
            confirmText: t('pages:updateUser.deleteModal.confirm'),
            cancelText: t('pages:updateUser.deleteModal.cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await deleteUser({
                variables: { id: match.params.id }
            });
            toast.success(t(`api:codes.${result.data.deleteUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Helmet>
                <title>{t('pages:updateUser.meta.title')}</title>
            </Helmet>

            <h1>
                {t('pages:updateUser.title')}
                <br />
                <small className="text-muted">
                    {t('pages:updateUser.subtitle')}
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
                            label={t('pages:updateUser.form.emailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('pages:updateUser.form.firstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('pages:updateUser.form.lastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('pages:updateUser.form.dateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <Field
                            name="roles"
                            label={t('pages:updateUser.form.roles')}
                            options={AVAILABLE_ROLES.map(role => ({
                                value: role,
                                label: t(`api:userRoles.${role}`)
                            }))}
                            component={CheckboxGroupInput}
                        />

                        <FormGroup className="text-right">
                            <Button to="/user" className="mr-1" tag={Link}>
                                {t('pages:updateUser.cancelButton')}
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
                                    {t('pages:updateUser.unlockButton')}
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
                                    {t('pages:updateUser.lockButton')}
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
                                {t('pages:updateUser.deleteButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                                disabled={
                                    isLocking || isUnlocking || isDeleting
                                }
                            >
                                {t('pages:updateUser.submitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
