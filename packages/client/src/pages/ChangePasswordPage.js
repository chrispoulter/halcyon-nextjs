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
            .label(t('UI:Pages:ChangePassword:Form:CurrentPassword'))
            .required(),
        newPassword: Yup.string()
            .label(t('UI:Pages:ChangePassword:Form:NewPassword'))
            .min(8)
            .max(50)
            .required(),
        confirmNewPassword: Yup.string()
            .label(t('UI:Pages:ChangePassword:Form:ConfirmNewPassword'))
            .required()
            .oneOf([Yup.ref('newPassword')], d =>
                t('UI:Validation:FieldsDoNotMatch', d)
            )
    });

    const onSubmit = async variables => {
        try {
            const result = await changePassword({ variables });
            toast.success(t(`Api:Codes:${result.data.changePassword.code}`));
            history.push('/my-account');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('UI:Pages:ChangePassword:Title')}</h1>
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
                                'UI:Pages:ChangePassword:Form:CurrentPassword'
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
                                'UI:Pages:ChangePassword:Form:NewPassword'
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
                                'UI:Pages:ChangePassword:Form:ConfirmNewPassword'
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
                                {t('UI:Pages:ChangePassword:CancelButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('UI:Pages:ChangePassword:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>

            <p>
                {t('UI:Pages:ChangePassword:ForgotPasswordPrompt')}{' '}
                <Link to="/forgot-password">
                    {t('UI:Pages:ChangePassword:ForgotPasswordLink')}
                </Link>
            </p>
        </Container>
    );
};
