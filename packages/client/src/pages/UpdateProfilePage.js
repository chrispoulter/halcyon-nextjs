import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Alert, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { GET_PROFILE, UPDATE_PROFILE } from '../graphql';
import { Spinner, TextInput, DateInput, Button } from '../components';

export const UpdateProfilePage = ({ history }) => {
    const { t } = useTranslation();

    const { loading, data } = useQuery(GET_PROFILE);

    const [updateProfile] = useMutation(UPDATE_PROFILE);

    if (loading) {
        return <Spinner />;
    }

    if (!data?.getProfile) {
        return (
            <Alert color="info" className="container p-3 mb-3">
                {t('Pages:UpdateProfile:ProfileNotFound')}
            </Alert>
        );
    }

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('Pages:UpdateProfile:Form:EmailAddress'))
            .max(254, t('Validation:Max'))
            .email(t('Validation:Email'))
            .required(t('Validation:Required')),
        firstName: Yup.string()
            .label(t('Pages:UpdateProfile:Form:FirstName'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        lastName: Yup.string()
            .label(t('Pages:UpdateProfile:Form:LastName'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        dateOfBirth: Yup.string()
            .label(t('Pages:UpdateProfile:Form:DateOfBirth'))
            .required(t('Validation:Required'))
    });

    const onSubmit = async variables => {
        try {
            const result = await updateProfile({ variables });
            toast.success(t(`Codes:${result.data.updateProfile.code}`));
            history.push('/my-account');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('Pages:UpdateProfile:Title')}</h1>
            <hr />

            <Formik
                enableReinitialize={true}
                initialValues={data.getProfile}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <Field
                            name="emailAddress"
                            type="email"
                            label={t('Pages:UpdateProfile:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('Pages:UpdateProfile:Form:FirstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('Pages:UpdateProfile:Form:LastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('Pages:UpdateProfile:Form:DateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <FormGroup className="text-right">
                            <Button
                                to="/my-account"
                                className="mr-1"
                                tag={Link}
                            >
                                {t('Pages:UpdateProfile:CancelButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('Pages:UpdateProfile:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
