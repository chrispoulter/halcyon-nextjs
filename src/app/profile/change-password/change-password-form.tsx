'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { changePasswordAction } from '@/app/actions/changePasswordAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z
    .object({
        currentPassword: z
            .string({ message: 'Current Password is a required field' })
            .min(1, 'Current Password is a required field'),
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

type ChangePasswordFormValues = z.infer<typeof formSchema>;

type ChangePasswordFormProps = {
    className?: string;
};

export function ChangePasswordForm({ className }: ChangePasswordFormProps) {
    const router = useRouter();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    async function onSubmit(data: ChangePasswordFormValues) {
        const result = await changePasswordAction(data);

        toast({
            title: 'Your password has been changed.',
            description: JSON.stringify(result),
        });

        router.push('/profile');
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('space-y-6', className)}
            >
                <TextFormField
                    field="currentPassword"
                    label="Current Password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
                    required
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        field="password"
                        label="Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        className="flex-1"
                    />
                    <TextFormField
                        field="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        className="flex-1"
                    />
                </div>

                <Button asChild variant="secondary" className="w-full">
                    <Link href="/profile">Cancel</Link>
                </Button>

                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
