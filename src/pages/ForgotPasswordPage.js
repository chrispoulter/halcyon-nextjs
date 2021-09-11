import React from 'react';
import { Helmet } from 'react-helmet';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { FORGOT_PASSWORD } from '../graphql';
import { TextInput, Button, useToast } from '../components';
import { trackEvent, captureError } from '../utils/logger';

export const ForgotPasswordPage = ({ history }) => {
    const toast = useToast();

    const [forgotPassword] = useMutation(FORGOT_PASSWORD);

    const onSubmit = async variables => {
        try {
            const result = await forgotPassword({ variables });

            toast.success(result.data.forgotPassword.message);

            trackEvent('password_reminder');

            history.push('/login');
        } catch (error) {
            captureError(error);
        }
    };

    return (
        <Container>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>

            <h1>Forgot Password</h1>
            <hr />

            <Formik
                initialValues={{
                    emailAddress: ''
                }}
                validationSchema={Yup.object().shape({
                    emailAddress: Yup.string()
                        .label('Email Address')
                        .email()
                        .required()
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
