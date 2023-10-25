import { Formik, Form } from 'formik';
import { InferType, object, ref, string } from 'yup';
import { Input } from '@/components/Input/Input';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { toDateOnlyISOString } from '@/utils/date';

const schema = object({
    emailAddress: string().label('Email Address').max(254).email().required(),
    password: string().label('Password').min(8).max(50).required(),
    confirmPassword: string()
        .label('Confirm Password')
        .required()
        .oneOf([ref('password')], 'Passwords do not match'),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: string()
        .label('Date Of Birth')
        .required()
        .test(
            'date-in-past',
            '${label} must be in the past',
            value => new Date(value) < new Date()
        )
        .transform(toDateOnlyISOString)
});

export type RegisterFormValues = InferType<typeof schema>;

const initialValues = schema.getDefault() as any;

type RegisterFormProps = {
    onSubmit: (values: RegisterFormValues) => void;
    className?: string;
};

export const RegisterForm = ({ onSubmit, className }: RegisterFormProps) => (
    <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
    >
        {({ isSubmitting }) => (
            <Form noValidate className={className}>
                <Input
                    label="Email Address"
                    name="emailAddress"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                    className="mb-3"
                />
                <div className="sm:flex sm:gap-3">
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className="mb-3 sm:flex-1"
                    />
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className="mb-3 sm:flex-1"
                    />
                </div>
                <div className="sm:flex sm:gap-3">
                    <Input
                        label="First Name"
                        name="firstName"
                        type="text"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={isSubmitting}
                        className="mb-3 sm:flex-1"
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        type="text"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={isSubmitting}
                        className="mb-3 sm:flex-1"
                    />
                </div>
                <DatePicker
                    label="Date Of Birth"
                    name="dateOfBirth"
                    required
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    disabled={isSubmitting}
                    className="mb-5"
                />
                <ButtonGroup>
                    <Button type="submit" loading={isSubmitting}>
                        Submit
                    </Button>
                </ButtonGroup>
            </Form>
        )}
    </Formik>
);
