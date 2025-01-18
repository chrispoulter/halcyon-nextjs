'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { GetProfileResponse } from '@/app/profile/profile-types';
import { changePasswordAction } from '@/app/profile/actions/change-password-action';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/loading-button';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

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

type ChangePasswordFormValues = z.infer<typeof schema>;

type ChangePasswordFormProps = {
    profile: GetProfileResponse;
};

export function ChangePasswordForm({ profile }: ChangePasswordFormProps) {
    const router = useRouter();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const { execute, isPending } = useAction(changePasswordAction, {
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Your password has been changed.',
            });

            router.push('/profile');
        },
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onSubmit(data: ChangePasswordFormValues) {
        execute({
            ...data,
            version: profile.version,
        });
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField<ChangePasswordFormValues>
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
                    required
                    disabled={isPending}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField<ChangePasswordFormValues>
                        name="newPassword"
                        label="New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isPending}
                        className="flex-1"
                    />
                    <TextFormField<ChangePasswordFormValues>
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
                    <Button asChild variant="outline">
                        <Link href="/profile">Cancel</Link>
                    </Button>

                    <LoadingButton type="submit" loading={isPending}>
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
