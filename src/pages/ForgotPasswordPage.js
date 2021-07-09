import React from 'react';
import { Helmet } from 'react-helmet';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { FORGOT_PASSWORD } from '../graphql';
import { TextInput, Button } from '../components';
import { trackEvent, captureError } from '../utils/logger';

export const ForgotPasswordPage = ({ history }) => {
    const [forgotPassword] = useMutation(FORGOT_PASSWORD);

    const onSubmit = async variables => {
        try {
            const result = await forgotPassword({ variables });

            toast.success(result.data.forgotPassword.code.message);

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

                        <FormGroup className="text-right">
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                Submit
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
