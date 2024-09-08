import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GetProfileResponse } from '@/features/manage/manage-types';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { ButtonGroup } from '@/components/button-group';
import { FormSkeleton } from '@/components/form-skeleton';
import { InputSkeleton } from '@/components/input-skeleton';

const schema = z
    .object({
        currentPassword: z.string({
            message: 'Current Password is a required field'
        }),
        newPassword: z
            .string({ message: 'New Password is a required field' })
            .min(8, 'New Password must be at least 8 characters')
            .max(50, 'New Password must be no more than 50 characters'),
        confirmNewPassword: z.string({
            message: 'Confirm New Password is a required field'
        })
    })
    .refine(data => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword']
    });

export type ChangePasswordFormValues = z.infer<typeof schema>;

type ChangePasswordFormProps = {
    profile?: GetProfileResponse;
    options?: JSX.Element;
    isLoading?: boolean;
    onSubmit: (values: ChangePasswordFormValues) => void;
    className?: string;
};

type ChangePasswordFormInternalProps = Omit<ChangePasswordFormProps, 'profile'>;

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
    options,
    isLoading,
    onSubmit,
    className
}: ChangePasswordFormInternalProps) => {
    const { handleSubmit, control } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(schema)
    });

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className={className}
        >
            <Input
                control={control}
                label="Current Password"
                name="currentPassword"
                type="password"
                maxLength={50}
                autoComplete="current-password"
                required
                disabled={isLoading}
                className="mb-3"
            />
            <div className="sm:flex sm:gap-3">
                <Input
                    control={control}
                    label="New Password"
                    name="newPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    className="mb-5 sm:flex-1"
                />
                <Input
                    control={control}
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    className="mb-5 sm:flex-1"
                />
            </div>
            <ButtonGroup>
                {options}
                <Button type="submit" loading={isLoading}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};

export const ChangePasswordForm = ({
    profile,
    ...props
}: ChangePasswordFormProps) => {
    if (!profile) {
        return <ChangePasswordFormLoading />;
    }

    return <ChangePasswordFormInternal {...props} />;
};
