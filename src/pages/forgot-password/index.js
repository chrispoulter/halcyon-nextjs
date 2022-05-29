import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { TextInput, Button, Meta } from '../../components';
import { useToast } from '../../contexts';
import { useForgotPassword } from '../../services';

const ForgotPasswordPage = () => {
    const router = useRouter();

    const toast = useToast();

    const { request: forgotPassword } = useForgotPassword();

    const onSubmit = async variables => {
        const result = await forgotPassword(variables);

        if (result.ok) {
            toast.success(result.message);
            router.push('/login');
        }
    };

    return (
        <Container>
            <Meta title="Forgot Password" />

            <h1>Forgot Password</h1>
            <hr />

            <Formik
                initialValues={{
                    emailAddress: ''
                }}
                validationSchema={Yup.object({
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

export default ForgotPasswordPage;
