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
            .label(t('ui:Pages:ResetPassword:Form:EmailAddress'))
            .email(t('ui:Validation:Email'))
            .required(t('ui:Validation:Required')),
        newPassword: Yup.string()
            .label(t('ui:Pages:ResetPassword:Form:NewPassword'))
            .min(8, t('ui:Validation:Min'))
            .max(50, t('ui:Validation:Max'))
            .required(t('ui:Validation:Required')),
        confirmNewPassword: Yup.string()
            .label(t('ui:Pages:ResetPassword:Form:ConfirmNewPassword'))
            .required(t('ui:Validation:Required'))
            .oneOf([Yup.ref('newPassword')], d =>
                t('ui:Validation:FieldsDoNotMatch', d)
            )
    });

    const onSubmit = async variables => {
        try {
            const result = await resetPassword({
                variables: { token: match.params.token, ...variables }
            });

            toast.success(t(`api:Codes:${result.data.resetPassword.code}`));
            history.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('ui:Pages:ResetPassword:Title')}</h1>
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
                            label={t(
                                'ui:Pages:ResetPassword:Form:EmailAddress'
                            )}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />
                        <Field
                            name="newPassword"
                            type="password"
                            label={t('ui:Pages:ResetPassword:Form:NewPassword')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />
                        <Field
                            name="confirmNewPassword"
                            type="password"
                            label={t(
                                'ui:Pages:ResetPassword:Form:ConfirmNewPassword'
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
                                {t('ui:Pages:ResetPassword:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
