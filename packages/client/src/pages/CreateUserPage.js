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
            .label(t('Pages:CreateUser:Form:EmailAddress'))
            .max(254, t('Validation:Max'))
            .email(t('Validation:Email'))
            .required(t('Validation:Required')),
        password: Yup.string()
            .label(t('Pages:CreateUser:Form:Password'))
            .min(8, t('Validation:Min'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        confirmPassword: Yup.string()
            .label(t('Pages:CreateUser:Form:ConfirmPassword'))
            .required(t('Validation:Required'))
            .oneOf([Yup.ref('password')], d =>
                t('Validation:FieldsDoNotMatch', d)
            ),
        firstName: Yup.string()
            .label(t('Pages:CreateUser:Form:FirstName'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        lastName: Yup.string()
            .label(t('Pages:CreateUser:Form:LastName'))
            .max(50, t('Validation:Max'))
            .required(t('Validation:Required')),
        dateOfBirth: Yup.string()
            .label(t('Pages:CreateUser:Form:DateOfBirth'))
            .required(t('Validation:Required'))
    });

    const onSubmit = async variables => {
        try {
            const result = await createUser({ variables });
            toast.success(t(`Codes:${result.data.createUser.code}`));
            history.push('/user');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>
                {t('Pages:CreateUser:Title')}
                <br />
                <small className="text-muted">
                    {t('Pages:CreateUser:Subtitle')}
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
                            label={t('Pages:CreateUser:Form:EmailAddress')}
                            required
                            maxLength={254}
                            autoComplete="username"
                            component={TextInput}
                        />

                        <Field
                            name="password"
                            type="password"
                            label={t('Pages:CreateUser:Form:Password')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <Field
                            name="confirmPassword"
                            type="password"
                            label={t('Pages:CreateUser:Form:ConfirmPassword')}
                            required
                            maxLength={50}
                            autoComplete="new-password"
                            component={TextInput}
                        />

                        <Field
                            name="firstName"
                            type="text"
                            label={t('Pages:CreateUser:Form:FirstName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="lastName"
                            type="text"
                            label={t('Pages:CreateUser:Form:LastName')}
                            required
                            maxLength={50}
                            component={TextInput}
                        />

                        <Field
                            name="dateOfBirth"
                            type="date"
                            label={t('Pages:CreateUser:Form:DateOfBirth')}
                            required
                            component={DateInput}
                        />

                        <Field
                            name="roles"
                            label={t('Pages:CreateUser:Form:Roles')}
                            options={AVAILABLE_ROLES.map(role => ({
                                value: role,
                                label: t(`Roles:${role}`)
                            }))}
                            component={CheckboxGroupInput}
                        />

                        <FormGroup className="text-right">
                            <Button to="/user" className="mr-1" tag={Link}>
                                {t('Pages:CreateUser:CancelButton')}
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isSubmitting}
                            >
                                {t('Pages:CreateUser:SubmitButton')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
