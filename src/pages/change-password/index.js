import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { TextInput, Button, Meta } from '../../components';
import { useToast } from '../../contexts';
import { useChangePassword } from '../../services';

const ChangePasswordPage = () => {
    const router = useRouter();

    const toast = useToast();

    const { request: changePassword } = useChangePassword();

    const onSubmit = async variables => {
        const result = await changePassword(variables);

        if (result.ok) {
            toast.success(result.message);
            router.push('/my-account');
        }
    };

    return (
        <Container>
            <Meta title="Change Password" />

            <h1>Change Password</h1>
            <hr />

            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }}
                validationSchema={Yup.object({
                    currentPassword: Yup.string()
                        .label('Current Password')
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
                            name="currentPassword"
                            type="password"
                            label="Current Password"
                            required
                            maxLength={50}
                            autoComplete="current-password"
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
                            <Link href="/my-account" passHref>
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

            <p>
                Forgotten your password?{' '}
                <Link href="/forgot-password">Request reset</Link>
            </p>
        </Container>
    );
};

export default ChangePasswordPage;
