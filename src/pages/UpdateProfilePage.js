import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { GET_PROFILE, UPDATE_PROFILE } from '../graphql';
import { Spinner, TextInput, DateInput, Button, useToast } from '../components';
import { trackEvent, captureError } from '../utils/logger';

export const UpdateProfilePage = ({ history }) => {
    const toast = useToast();

    const { loading, data } = useQuery(GET_PROFILE);

    const [updateProfile] = useMutation(UPDATE_PROFILE);

    if (loading) {
        return <Spinner />;
    }

    if (!data?.getProfile) {
        return (
            <Container>
                <Alert variant="info">Profile could not be found.</Alert>
            </Container>
        );
    }

    const onSubmit = async variables => {
        try {
            const result = await updateProfile({ variables });

            toast.success(result.data.updateProfile.message);

            trackEvent('profile_updated');

            history.push('/my-account');
        } catch (error) {
            captureError(error);
        }
    };

    return (
        <Container>
            <Helmet>
                <title>Update Profile</title>
            </Helmet>

            <h1>Update Profile</h1>
            <hr />

            <Formik
                enableReinitialize={true}
                initialValues={data.getProfile}
                validationSchema={Yup.object().shape({
                    emailAddress: Yup.string()
                        .label('Email Address')
                        .max(254)
                        .email()
                        .required(),
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
                            name="firstName"
                            type="text"
                            label="First Name"
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label="Last Name"
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label="Date Of Birth"
                            required
                            component={DateInput}
                        />

                        <div className="mb-3 text-end">
                            <Button
                                to="/my-account"
                                as={Link}
                                variant="secondary"
                                className="me-1"
                            >
                                Cancel
                            </Button>
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
