import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { GetProfileResponse } from '@/models/manage.types';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { FormSkeleton, InputSkeleton } from '@/components/Skeleton/Skeleton';

const schema = Yup.object({
    currentPassword: Yup.string().label('Current Password').required(),
    newPassword: Yup.string().label('New Password').min(8).max(50).required(),
    confirmNewPassword: Yup.string()
        .label('Confirm New Password')
        .required()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
});

export type ChangePasswordFormValues = Yup.InferType<typeof schema>;

type ChangePasswordFormProps = {
    profile?: GetProfileResponse;
    options?: JSX.Element;
    onSubmit: (values: ChangePasswordFormValues) => void;
    className?: string;
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

export const ChangePasswordFormInternal = ({
    onSubmit,
    options,
    className
}: ChangePasswordFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(schema)
    });

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className={className}
        >
            <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                maxLength={50}
                autoComplete="current-password"
                required
                control={control}
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
                    control={control}
                    className="mb-5 sm:flex-1"
                />
                <Input
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    control={control}
                    className="mb-5 sm:flex-1"
                />
            </div>
            <ButtonGroup>
                {options}
                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};

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
