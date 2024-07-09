import { Formik, Form, Field } from 'formik';
import { InferType, number, object, ref, string } from 'yup';
import { GetProfileResponse } from '@/features/manage/manageTypes';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { FormSkeleton } from '@/components/Form/FormSkeleton';
import { InputSkeleton } from '@/components/Form/InputSkeleton';

const schema = object({
    currentPassword: string().label('Current Password').required(),
    newPassword: string().label('New Password').min(8).max(50).required(),
    confirmNewPassword: string()
        .label('Confirm New Password')
        .required()
        .oneOf([ref('newPassword')], 'Passwords do not match'),
    version: number().label('Version').required()
});

export type ChangePasswordFormValues = InferType<typeof schema>;

const initialValues = schema.getDefault() as any;

type ChangePasswordFormProps = {
    profile?: GetProfileResponse;
    options?: JSX.Element;
    onSubmit: (values: ChangePasswordFormValues) => void;
    className?: string;
};

type ChangePasswordFormInternalProps = ChangePasswordFormProps & {
    profile: GetProfileResponse;
};

const ChangePasswordFormLoading = () => (
    <FormSkeleton>
        <InputSkeleton className="mb-3" />
        <div className="sm:flex sm:gap-3">
            <InputSkeleton className="mb-3 sm:flex-1" />
            <InputSkeleton className="mb-5 sm:flex-1" />
        </div>
    </FormSkeleton>
);

const ChangePasswordFormInternal = ({
    profile: { version },
    onSubmit,
    options,
    className
}: ChangePasswordFormInternalProps) => (
    <Formik
        initialValues={{ ...initialValues, version }}
        validationSchema={schema}
        onSubmit={onSubmit}
    >
        {({ isSubmitting }) => (
            <Form noValidate className={className}>
                <Field type="hidden" name="version" />
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

export const ChangePasswordForm = ({
    profile,
    onSubmit,
    options
}: ChangePasswordFormProps) => {
    if (!profile) {
        return <ChangePasswordFormLoading />;
    }

    return (
        <ChangePasswordFormInternal
            profile={profile}
            onSubmit={onSubmit}
            options={options}
        />
    );
};
