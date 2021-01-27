import React from 'react';
import { useTranslation } from 'react-i18next';
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
            .label(t('Pages:ResetPassword:Form:EmailAddress'))
            .email(t('Validation:Email'))
            .required(t('Validation:Required')),
        newPassword: Yup.string()
            .label(t('Pages:ResetPassword:Form:NewPassword'))
            .min(8, t('Validation:Min'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        confirmNewPassword: Yup.string()
            .label(t('Pages:ResetPassword:Form:ConfirmNewPassword'))
            .required(t('Validation:Required'))
            .oneOf([Yup.ref('newPassword')], d =>
                t('Validation:FieldsDoNotMatch', d)
            )
    });

    const onSubmit = async variables => {
        try {
            const result = await resetPassword({
                variables: { token: match.params.token, ...variables }
            });

            toast.success(t(`Api:Codes:${result.data.resetPassword.code}`));
            history.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('Pages:ResetPassword:Title')}</h1>
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
                            label={t('Pages:ResetPassword:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />
                        <Field
                            name="newPassword"
                            type="password"
                            label={t('Pages:ResetPassword:Form:NewPassword')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />
                        <Field
                            name="confirmNewPassword"
                            type="password"
                            label={t(
                                'Pages:ResetPassword:Form:ConfirmNewPassword'
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
                                {t('Pages:ResetPassword:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
