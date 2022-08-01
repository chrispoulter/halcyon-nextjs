import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import { TextInput, Button, Meta } from '../../components';
import { showToast } from '../../features';
import { useForgotPasswordMutation } from '../../redux';

const ForgotPasswordPage = () => {
    const router = useRouter();

    const dispatch = useDispatch();

    const [forgotPassword] = useForgotPasswordMutation();

    const onSubmit = async variables => {
        const { data: result } = await forgotPassword(variables);

        if (result) {
            dispatch(
                showToast({
                    variant: 'success',
                    message: result.message
                })
            );

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
                        <TextInput
                            name="emailAddress"
                            type="email"
                            label="Email Address"
                            required
                            maxLength={254}
                            autoComplete="username"
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
