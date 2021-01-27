import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { GENERATE_TOKEN } from '../graphql';
import { TextInput, CheckboxInput, Button, AuthContext } from '../components';

const initialValues = {
    emailAddress: '',
    password: '',
    rememberMe: true
};

export const LoginPage = ({ history }) => {
    const { t } = useTranslation();

    const { setToken } = useContext(AuthContext);

    const [generateToken] = useMutation(GENERATE_TOKEN);

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('UI:Pages:Login:Form:EmailAddress'))
            .email()
            .required(),
        password: Yup.string()
            .label(t('UI:Pages:Login:Form:Password'))
            .required()
    });

    const onSubmit = async variables => {
        try {
            const result = await generateToken({
                variables: { grantType: 'PASSWORD', ...variables }
            });

            setToken(
                result.data.generateToken.accessToken,
                variables.rememberMe
            );

            history.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('UI:Pages:Login:Title')}</h1>
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
                            label={t('UI:Pages:Login:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="password"
                            type="password"
                            label={t('UI:Pages:Login:Form:Password')}
                            required
                            maxLength={50}
                            autoComplete="current-password"
                            component={TextInput}
                        />

                        <Field
                            name="rememberMe"
                            label={t('UI:Pages:Login:Form:RememberMe')}
                            component={CheckboxInput}
                        />

                        <FormGroup className="text-right">
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('UI:Pages:Login:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>

            <p>
                {t('UI:Pages:Login:RegisterPrompt')}{' '}
                <Link to="/register">{t('UI:Pages:Login:RegisterLink')}</Link>
            </p>
            <p>
                {t('UI:Pages:ChangePassword:ForgotPasswordPrompt')}{' '}
                <Link to="/forgot-password">
                    {t('UI:Pages:ChangePassword:ForgotPasswordLink')}
                </Link>
            </p>
        </Container>
    );
};
