import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { REGISTER, GENERATE_TOKEN } from '../graphql';
import { TextInput, DateInput, Button, AuthContext } from '../components';

const initialValues = {
    emailAddress: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: ''
};

export const RegisterPage = ({ history }) => {
    const { t } = useTranslation();

    const { setToken } = useContext(AuthContext);

    const [register] = useMutation(REGISTER);

    const [generateToken] = useMutation(GENERATE_TOKEN);

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('UI:Pages:Register:Form:EmailAddress'))
            .max(254)
            .email()
            .required(),
        password: Yup.string()
            .label(t('UI:Pages:Register:Form:Password'))
            .min(8)
            .max(50)
            .required(),
        confirmPassword: Yup.string()
            .label(t('UI:Pages:Register:Form:ConfirmPassword'))
            .required()
            .oneOf([Yup.ref('password')], d =>
                t('UI:Validation:FieldsDoNotMatch', d)
            ),
        firstName: Yup.string()
            .label(t('UI:Pages:Register:Form:FirstName'))
            .max(50)
            .required(),
        lastName: Yup.string()
            .label(t('UI:Pages:Register:Form:Last Name'))
            .max(50)
            .required(),
        dateOfBirth: Yup.string()
            .label(t('UI:Pages:Register:Form:DateOfBirth'))
            .required()
    });

    const onSubmit = async variables => {
        try {
            await register({ mutation: REGISTER, variables });

            const result = await generateToken({
                variables: { grantType: 'PASSWORD', ...variables }
            });

            setToken(result.data.generateToken.accessToken);
            history.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('UI:Pages:Register:Title')}</h1>
            <hr />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <Field
                            name="emailAddress"
                            type="email"
                            label={t('UI:Pages:Register:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="password"
                            type="password"
                            label={t('UI:Pages:Register:Form:Password')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <Field
                            name="confirmPassword"
                            type="password"
                            label={t('UI:Pages:Register:Form:ConfirmPassword')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('UI:Pages:Register:Form:FirstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('UI:Pages:Register:Form:LastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('UI:Pages:Register:Form:DateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <FormGroup className="text-right">
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('UI:Pages:Register:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>

            <p>
                {t('UI:Pages:Register:LoginPrompt')}{' '}
                <Link to="/login">{t('UI:Pages:Register:LoginLink')}</Link>
            </p>
        </Container>
    );
};
