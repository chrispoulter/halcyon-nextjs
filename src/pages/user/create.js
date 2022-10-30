import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import {
    TextInput,
    DateInput,
    CheckboxGroupInput,
    Button,
    Meta
} from '@/components';
import { useCreateUserMutation, showToast } from '@/redux';
import { ROLE_OPTIONS, USER_ADMINISTRATOR_ROLES } from '@/utils/auth';

const CreateUserPage = () => {
    const router = useRouter();

    const dispatch = useDispatch();

    const [createUser] = useCreateUserMutation();

    const onSubmit = async variables => {
        const { data: result } = await createUser(variables);

        if (result) {
            dispatch(
                showToast({
                    variant: 'success',
                    message: result.message
                })
            );

            router.push('/user');
        }
    };

    return (
        <Container>
            <Meta title="Create User" />

            <h1>
                User
                <br />
                <small className="text-muted">Create</small>
            </h1>
            <hr />

            <Formik
                initialValues={{
                    emailAddress: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    roles: []
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

                        <CheckboxGroupInput
                            name="roles"
                            label="Roles"
                            options={ROLE_OPTIONS}
                        />

                        <div className="mb-3 text-end">
                            <Link href="/user" passHref>
                                <Button variant="secondary" className="me-1">
                                    Cancel
                                </Button>
                            </Link>
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

CreateUserPage.auth = { requiredRoles: USER_ADMINISTRATOR_ROLES };

export default CreateUserPage;
