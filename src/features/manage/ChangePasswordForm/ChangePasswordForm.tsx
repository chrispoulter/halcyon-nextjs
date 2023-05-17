import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = Yup.object({
    currentPassword: Yup.string()
        .label('Current Password')
        .default('')
        .required(),
    newPassword: Yup.string()
        .label('New Password')
        .default('')
        .min(8)
        .max(50)
        .required(),
    confirmNewPassword: Yup.string()
        .label('Confirm New Password')
        .default('')
        .required()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
});

const initialValues = schema.getDefault();

export type ChangePasswordFormValues = Yup.InferType<typeof schema>;

type ChangePasswordFormProps = {
    options?: JSX.Element;
    onSubmit: (values: ChangePasswordFormValues) => void;
    className?: string;
};

export const ChangePasswordForm = ({
    onSubmit,
    options,
    className
}: ChangePasswordFormProps) => (
    <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
    >
        {({ isSubmitting }) => (
            <Form noValidate className={className}>
                <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
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
                    {options}
                    <Button type="submit" loading={isSubmitting}>
                        Submit
                    </Button>
                </ButtonGroup>
            </Form>
        )}
    </Formik>
);
