import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { FORGOT_PASSWORD } from '../graphql';
import { TextInput, Button } from '../components';

const initialValues = {
    emailAddress: ''
};

export const ForgotPasswordPage = ({ history }) => {
    const { t } = useTranslation();

    const [forgotPassword] = useMutation(FORGOT_PASSWORD);

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('ui:Pages:ForgotPassword:Form:EmailAddress'))
            .email(t('ui:Validation:Email'))
            .required(t('ui:Validation:Required'))
    });

    const onSubmit = async variables => {
        try {
            const result = await forgotPassword({ variables });
            toast.success(t(`api:Codes:${result.data.forgotPassword.code}`));
            history.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('ui:Pages:ForgotPassword:Title')}</h1>
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
                            label={t(
                                'ui:Pages:ForgotPassword:Form:EmailAddress'
                            )}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <FormGroup className="text-right">
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('ui:Pages:ForgotPassword:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
