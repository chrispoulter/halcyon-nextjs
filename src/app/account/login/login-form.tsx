'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { loginAction } from '@/app/account/actions/login-action';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';
import { isServerActionSuccess } from '@/lib/action-types';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

type LoginFormValues = z.infer<typeof schema>;

export function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
        const result = await loginAction(data);

        if (!isServerActionSuccess(result)) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={result} />,
            });

            return;
        }

        router.push('/');
    }

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField<LoginFormValues>
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                />

                <TextFormField<LoginFormValues>
                    field="password"
                    label="Password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-32"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
