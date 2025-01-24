'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetPasswordAction } from '@/app/account/actions/reset-password-action';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/loading-button';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

const schema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .email('Email Address must be a valid email'),
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

type ResetPasswordFormValues = z.infer<typeof schema>;

type ResetPasswordFormProps = {
    token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const { execute, isPending } = useAction(resetPasswordAction, {
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Your password has been reset.',
            });

            router.push('/account/login');
        },
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onSubmit(data: ResetPasswordFormValues) {
        execute({ ...data, token });
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField
                    control={form.control}
                    name="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isPending}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        control={form.control}
                        name="newPassword"
                        label="New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isPending}
                        className="flex-1"
                    />
                    <TextFormField
                        control={form.control}
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isPending}
                        className="flex-1"
                    />
                </div>

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <LoadingButton type="submit" loading={isPending}>
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
