import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { TextInput, DateInput, Button, Meta } from '../../components';
import { useAuth } from '../../contexts';
import { useRegister, useCreateToken } from '../../services';

const RegisterPage = () => {
    const router = useRouter();

    const { setToken } = useAuth();

    const { request: register } = useRegister();

    const { request: createToken } = useCreateToken();

    const onSubmit = async variables => {
        let result = await register(variables);

        if (result.ok) {
            result = await createToken(variables);

            if (result.ok) {
                setToken(result.data.accessToken);
                router.push('/');
            }
        }
    };

    return (
        <Container>
            <Meta title="Register" />

            <h1>Register</h1>
            <hr />

            <Formik
                initialValues={{
                    emailAddress: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    dateOfBirth: ''
                }}
                validationSchema={Yup.object({
                    emailAddress: Yup.string()
                        .label('Email Address')
                        .max(254)
                        .email()
                        .required(),
                    password: Yup.string()
                        .label('Password')
                        .min(8)
                        .max(50)
                        .required(),
                    confirmPassword: Yup.string()
                        .label('Confirm Password')
                        .required()
                        .oneOf([Yup.ref('password')]),
                    firstName: Yup.string()
                        .label('First Name')
                        .max(50)
                        .required(),
                    lastName: Yup.string()
                        .label('Last Name')
                        .max(50)
                        .required(),
                    dateOfBirth: Yup.string().label('Date Of Birth').required()
                })}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <TextInput
                            name="emailAddress"
                            type="email"
                            label="Email Address"
                            required
                            maxLength={254}
                            autoComplete="username"
                        />

                        <TextInput
                            name="password"
                            type="password"
                            label="Password"
                            required
                            maxLength={50}
                            autoComplete="new-password"
                        />

                        <TextInput
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            required
                            maxLength={50}
                            autoComplete="new-password"
                        />

                        <TextInput
                            name="firstName"
                            type="text"
                            label="First Name"
                            required
                            maxLength={50}
                        />

                        <TextInput
                            name="lastName"
                            type="text"
                            label="Last Name"
                            required
                            maxLength={50}
                        />

                        <DateInput
                            name="dateOfBirth"
                            type="date"
                            label="Date Of Birth"
                            required
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

            <p>
                Already have an account? <Link href="/login">Log in now</Link>
            </p>
        </Container>
    );
};

export default RegisterPage;
