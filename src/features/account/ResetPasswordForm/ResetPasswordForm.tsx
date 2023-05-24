import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = z
    .object({
        emailAddress: z.string().email(),
        newPassword: z.string().min(8).max(50),
        confirmNewPassword: z.string()
    })
    .refine(data => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword']
    });

export type ResetPasswordFormValues = z.infer<typeof schema>;

type ResetPasswordFormProps = {
    onSubmit: (values: ResetPasswordFormValues) => void;
};

export const ResetPasswordForm = ({ onSubmit }: ResetPasswordFormProps) => {
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
                label="Email Address"
                name="emailAddress"
                type="email"
                maxLength={254}
                autoComplete="username"
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
                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};
