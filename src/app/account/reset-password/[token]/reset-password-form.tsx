'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetPasswordAction } from '@/app/actions/resetPasswordAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .min(1, 'Email Address is a required field')
            .email('Email Address must be a valid email'),
        newPassword: z
            .string({ message: 'New Password is a required field' })
            .min(8, 'New Password must be at least 8 characters')
            .max(50, 'New Password must be no more than 50 characters'),
        confirmNewPassword: z
            .string({ message: 'Confirm New Password is a required field' })
            .min(1, 'Confirm New Password is a required field'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    });

type ResetPasswordFormValues = z.infer<typeof formSchema>;

type ResetPasswordFormProps = {
    token: string;
    className?: string;
};

export function ResetPasswordForm({
    token,
    className,
}: ResetPasswordFormProps) {
    const router = useRouter();

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    async function onSubmit(data: ResetPasswordFormValues) {
        const result = await resetPasswordAction({ ...data, token });

        toast({
            title: 'Your password has been reset.',
            description: JSON.stringify(result),
        });

        router.push('/account/login');
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('space-y-6', className)}
            >
                <TextFormField
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        field="newPassword"
                        label="New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        className="flex-1"
                    />
                    <TextFormField
                        field="confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        className="flex-1"
                    />
                </div>

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
