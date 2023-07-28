import { Formik, Form } from 'formik';
import { InferType, object, ref, string } from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = object({
    emailAddress: string().label('Email Address').email().required(),
    newPassword: string().label('New Password').min(8).max(50).required(),
    confirmNewPassword: string()
        .label('Confirm New Password')
        .required()
        .oneOf([ref('newPassword')], 'Passwords do not match')
});

export type ResetPasswordFormValues = InferType<typeof schema>;

const initialValues = schema.getDefault() as any;

type ResetPasswordFormProps = {
    onSubmit: (values: ResetPasswordFormValues) => void;
};

export const ResetPasswordForm = ({ onSubmit }: ResetPasswordFormProps) => (
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
                    className="mb-3"
                />
                <div className="sm:flex sm:gap-3">
                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className="mb-5 sm:flex-1"
                    />
                    <Input
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className="mb-5 sm:flex-1"
                    />
                </div>
                <ButtonGroup>
                    <Button type="submit" loading={isSubmitting}>
                        Submit
                    </Button>
                </ButtonGroup>
            </Form>
        )}
    </Formik>
);
