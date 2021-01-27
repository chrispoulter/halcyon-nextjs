import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { CREATE_USER } from '../graphql';
import {
    TextInput,
    DateInput,
    CheckboxGroupInput,
    Button
} from '../components';
import { AVAILABLE_ROLES } from '../utils/auth';

const initialValues = {
    emailAddress: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    roles: []
};

export const CreateUserPage = ({ history }) => {
    const { t } = useTranslation();

    const [createUser] = useMutation(CREATE_USER);

    const validationSchema = Yup.object().shape({
        emailAddress: Yup.string()
            .label(t('UI:Pages:CreateUser:Form:EmailAddress'))
            .max(254)
            .email()
            .required(),
        password: Yup.string()
            .label(t('UI:Pages:CreateUser:Form:Password'))
            .min(8)
            .max(50)
            .required(),
        confirmPassword: Yup.string()
            .label(t('UI:Pages:CreateUser:Form:ConfirmPassword'))
            .required()
            .oneOf([Yup.ref('password')], d =>
                t('UI:Validation:FieldsDoNotMatch', d)
            ),
        firstName: Yup.string()
            .label(t('UI:Pages:CreateUser:Form:FirstName'))
            .max(50)
            .required(),
        lastName: Yup.string()
            .label(t('UI:Pages:CreateUser:Form:LastName'))
            .max(50)
            .required(),
        dateOfBirth: Yup.string()
            .label(t('UI:Pages:CreateUser:Form:DateOfBirth'))
            .required()
    });

    const onSubmit = async variables => {
        try {
            const result = await createUser({ variables });
            toast.success(t(`Api:Codes:${result.data.createUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>
                {t('UI:Pages:CreateUser:Title')}
                <br />
                <small className="text-muted">
                    {t('UI:Pages:CreateUser:Subtitle')}
                </small>
            </h1>
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
                            label={t('UI:Pages:CreateUser:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="password"
                            type="password"
                            label={t('UI:Pages:CreateUser:Form:Password')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <Field
                            name="confirmPassword"
                            type="password"
                            label={t(
                                'UI:Pages:CreateUser:Form:ConfirmPassword'
                            )}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('UI:Pages:CreateUser:Form:FirstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('UI:Pages:CreateUser:Form:LastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('UI:Pages:CreateUser:Form:DateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <Field
                            name="roles"
                            label={t('UI:Pages:CreateUser:Form:Roles')}
                            options={AVAILABLE_ROLES.map(role => ({
                                value: role,
                                label: t(`Api:Roles:${role}`)
                            }))}
                            component={CheckboxGroupInput}
                        />

                        <FormGroup className="text-right">
                            <Button to="/user" className="mr-1" tag={Link}>
                                {t('UI:Pages:CreateUser:CancelButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('UI:Pages:CreateUser:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
