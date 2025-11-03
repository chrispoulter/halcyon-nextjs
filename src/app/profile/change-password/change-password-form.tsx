import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { LoadingButton } from '@/components/loading-button';
import { Input } from '@/components/ui/input';

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
        <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Current Password
                        </FieldLabel>
                        <Input
                            {...field}
                            type="password"
                            maxLength={50}
                            autoComplete="current-password"
                            required
                            disabled={loading}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <div className="flex flex-col gap-6 sm:flex-row">
                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                maxLength={50}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmNewPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Confirm New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                maxLength={50}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                {children}

                <LoadingButton type="submit" loading={loading}>
                    Submit
                </LoadingButton>
            </div>
        </form>
    );
}
