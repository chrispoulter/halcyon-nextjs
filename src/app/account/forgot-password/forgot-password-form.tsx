'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { forgotPasswordAction } from '@/app/actions/forgotPasswordAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: '',
        },
    });

    const { execute, isPending } = useAction(forgotPasswordAction, {
        onSuccess() {
            toast({
                title: 'Instructions as to how to reset your password have been sent to you via email.',
            });

            router.push('/account/login');
        },
        onError() {
            toast({
                variant: 'destructive',
                title: 'An error occurred while processing your request.',
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
                <TextFormField
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isPending}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button type="submit" disabled={isPending}>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}
