import { Formik, Form } from 'formik';
import { InferType, object, string } from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = object({
    emailAddress: string().label('Email Address').email().required(),
    password: string().label('Password').required()
});

export type LoginFormValues = InferType<typeof schema>;

const initialValues = schema.getDefault() as any;

type LoginFormProps = {
    onSubmit: (values: LoginFormValues) => void;
    className?: string;
};

export const LoginForm = ({ onSubmit, className }: LoginFormProps) => (
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
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
                    required
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
