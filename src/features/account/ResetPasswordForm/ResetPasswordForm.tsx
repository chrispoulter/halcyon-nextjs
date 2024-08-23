import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';

const schema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address is a required field' })
            .email('Email Address must be a valid email'),
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

export type ResetPasswordFormValues = z.infer<typeof schema>;

type ResetPasswordFormProps = {
    isLoading?: boolean;
    onSubmit: (values: ResetPasswordFormValues) => void;
};

export const ResetPasswordForm = ({
    isLoading,
    onSubmit
}: ResetPasswordFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(schema)
    });

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Input
                control={control}
                label="Email Address"
                name="emailAddress"
                type="email"
                maxLength={254}
                autoComplete="username"
                required
                disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
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
                    disabled={isSubmitting || isLoading}
                    className="mb-5 sm:flex-1"
                />
            </div>
            <ButtonGroup>
                <Button type="submit" loading={isSubmitting || isLoading}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};
