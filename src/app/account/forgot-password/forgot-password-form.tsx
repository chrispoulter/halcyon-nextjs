'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { forgotPasswordAction } from '@/app/account/actions/forgot-password-action';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/loading-button';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

type ForgotPasswordFormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
    const router = useRouter();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
        },
    });

    const { execute, isPending } = useAction(forgotPasswordAction, {
        onSuccess: () => {
            toast({
                title: 'Success',
                description:
                    'Instructions as to how to reset your password have been sent to you via email.',
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

    function onSubmit(data: ForgotPasswordFormValues) {
        execute(data);
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField<ForgotPasswordFormValues>
                    name="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isPending}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <LoadingButton type="submit" loading={isPending}>
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
