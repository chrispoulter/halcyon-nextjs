import { Formik, Form } from 'formik';
import { object, string, InferType } from 'yup';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';

const schema = object({
    emailAddress: string().label('Email Address').email().required()
});

export type ForgotPasswordFormValues = InferType<typeof schema>;

const initialValues = {} as ForgotPasswordFormValues;

type ForgotPasswordFormProps = {
    onSubmit: (values: ForgotPasswordFormValues) => void;
};

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => (
    <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
    >
        {({ isSubmitting }) => (
            <Form noValidate>
                <Input
                    label="Email Address"
                    name="emailAddress"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
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
