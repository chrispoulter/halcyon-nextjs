import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/loading-button';
import { TextFormField } from '@/components/text-form-field';

const schema = z
    .object({
        currentPassword: z
            .string({ message: 'Current Password must be a valid string' })
            .min(1, 'Current Password is a required field'),
        newPassword: z
            .string({ message: 'New Password must be a valid string' })
            .min(8, 'New Password must be at least 8 characters')
            .max(50, 'New Password must be no more than 50 characters'),
        confirmNewPassword: z
            .string({ message: 'Confirm New Password must be a valid string' })
            .min(1, 'Confirm New Password is a required field'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    });

export type ChangePasswordFormValues = z.infer<typeof schema>;

type ChangePasswordFormProps = {
    loading?: boolean;
    onSubmit: (data: ChangePasswordFormValues) => void;
    children?: React.ReactNode;
};

export function ChangePasswordForm({
    loading,
    onSubmit,
    children,
}: ChangePasswordFormProps) {
    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                        className="flex-1"
                    />
                    <TextFormField
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                        className="flex-1"
                    />
                </div>

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    {children}

                    <LoadingButton type="submit" loading={loading}>
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
