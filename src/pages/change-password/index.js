import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { TextInput, Button, Meta } from '../../components';
import { useChangePasswordMutation, showToast } from '../../redux';

const ChangePasswordPage = () => {
    const router = useRouter();

    const dispatch = useDispatch();

    const [changePassword] = useChangePasswordMutation();

    const onSubmit = async variables => {
        const { data: result } = await changePassword(variables);

        if (result) {
            dispatch(
                showToast({
                    variant: 'success',
                    message: result.message
                })
            );

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
                        <TextInput
                            name="currentPassword"
                            type="password"
                            label="Current Password"
                            required
                            maxLength={50}
                            autoComplete="current-password"
                        />
                        <TextInput
                            name="newPassword"
                            type="password"
                            label="New Password"
                            required
                            maxLength={50}
                            autoComplete="new-password"
                        />
                        <TextInput
                            name="confirmNewPassword"
                            type="password"
                            label="Confirm New Password"
                            required
                            maxLength={50}
                            autoComplete="new-password"
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
