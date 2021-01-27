import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { CHANGE_PASSWORD } from '../graphql';
import { TextInput, Button } from '../components';

const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
};

export const ChangePasswordPage = ({ history }) => {
    const { t } = useTranslation();

    const [changePassword] = useMutation(CHANGE_PASSWORD);

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .label(t('ui:Pages:ChangePassword:Form:CurrentPassword'))
            .required(t('ui:Validation:Required')),
        newPassword: Yup.string()
            .label(t('ui:Pages:ChangePassword:Form:NewPassword'))
            .min(8, t('ui:Validation:Min'))
            .max(50, t('ui:Validation:Max'))
            .required(t('ui:Validation:Required')),
        confirmNewPassword: Yup.string()
            .label(t('ui:Pages:ChangePassword:Form:ConfirmNewPassword'))
            .required(t('ui:Validation:Required'))
            .oneOf([Yup.ref('newPassword')], d =>
                t('ui:Validation:FieldsDoNotMatch', d)
            )
    });

    const onSubmit = async variables => {
        try {
            const result = await changePassword({ variables });
            toast.success(t(`api:Codes:${result.data.changePassword.code}`));
            history.push('/my-account');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('ui:Pages:ChangePassword:Title')}</h1>
            <hr />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <Field
                            name="currentPassword"
                            type="password"
                            label={t(
                                'ui:Pages:ChangePassword:Form:CurrentPassword'
                            )}
                            required
                            maxLength={50}
                            autoComplete="current-password"
                            component={TextInput}
                        />
                        <Field
                            name="newPassword"
                            type="password"
                            label={t(
                                'ui:Pages:ChangePassword:Form:NewPassword'
                            )}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />
                        <Field
                            name="confirmNewPassword"
                            type="password"
                            label={t(
                                'ui:Pages:ChangePassword:Form:ConfirmNewPassword'
                            )}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <FormGroup className="text-right">
                            <Button
                                to="/my-account"
                                className="mr-1"
                                tag={Link}
                            >
                                {t('ui:Pages:ChangePassword:CancelButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('ui:Pages:ChangePassword:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>

            <p>
                {t('ui:Pages:ChangePassword:ForgotPasswordPrompt')}{' '}
                <Link to="/forgot-password">
                    {t('ui:Pages:ChangePassword:ForgotPasswordLink')}
                </Link>
            </p>
        </Container>
    );
};
