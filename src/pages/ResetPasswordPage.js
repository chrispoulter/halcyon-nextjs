import React from 'react';
import { Helmet } from 'react-helmet';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { RESET_PASSWORD } from '../graphql';
import { TextInput, Button, useToast } from '../components';
import { trackEvent, captureError } from '../utils/logger';

export const ResetPasswordPage = ({ match, history }) => {
    const toast = useToast();

    const [resetPassword] = useMutation(RESET_PASSWORD);

    const onSubmit = async variables => {
        try {
            const result = await resetPassword({
                variables: { token: match.params.token, ...variables }
            });

            toast.success(result.data.resetPassword.message);

            trackEvent('password_reset');

            history.push('/login');
        } catch (error) {
            captureError(error);
        }
    };

    return (
        <Container>
            <Helmet>
                <title>Reset Password</title>
            </Helmet>

            <h1>Reset Password</h1>
            <hr />

            <Formik
                initialValues={{
                    emailAddress: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }}
                validationSchema={Yup.object().shape({
                    emailAddress: Yup.string()
                        .label('Email Address')
                        .email()
                        .required(),
                    newPassword: Yup.string()
                        .label('New Password')
                        .min(8)
                        .max(50)
                        .required(),
                    confirmNewPassword: Yup.string()
                        .label('Confirm New Password')
                        .required()
                        .oneOf([Yup.ref('newPassword')])
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
                            name="newPassword"
                            type="password"
                            label="New Password"
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />
                        <Field
                            name="confirmNewPassword"
                            type="password"
                            label="Confirm New Password"
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <div className="mb-3 text-end">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
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
