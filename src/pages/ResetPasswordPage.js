import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { RESET_PASSWORD } from '../graphql';
import { TextInput, Button } from '../components';

const initialValues = {
    emailAddress: '',
    newPassword: '',
    confirmNewPassword: ''
};

export const ResetPasswordPage = ({ match, history }) => {
    const { t } = useTranslation();

    const [resetPassword] = useMutation(RESET_PASSWORD);

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('pages.resetPassword.form.emailAddress'))
            .email()
            .required(),
        newPassword: Yup.string()
            .label(t('pages.resetPassword.form.newPassword'))
            .min(8)
            .max(50)
            .required(),
        confirmNewPassword: Yup.string()
            .label(t('pages.resetPassword.form.confirmNewPassword'))
            .required()
            .oneOf([Yup.ref('newPassword')])
    });

    const onSubmit = async variables => {
        try {
            const result = await resetPassword({
                variables: { token: match.params.token, ...variables }
            });

            toast.success(t(`api.codes.${result.data.resetPassword.code}`));
            history.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Helmet>
                <title>{t('pages.resetPassword.meta.title')}</title>
            </Helmet>

            <h1>{t('pages.resetPassword.title')}</h1>
            <hr />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <Field
                            name="emailAddress"
                            type="email"
                            label={t('pages.resetPassword.form.emailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />
                        <Field
                            name="newPassword"
                            type="password"
                            label={t('pages.resetPassword.form.newPassword')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />
                        <Field
                            name="confirmNewPassword"
                            type="password"
                            label={t(
                                'pages.resetPassword.form.confirmNewPassword'
                            )}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <FormGroup className="text-right">
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('pages.resetPassword.submitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
