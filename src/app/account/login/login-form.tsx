'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginAction } from '@/app/account/actions/login-action';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/loading-button';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

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

    const { execute, isPending } = useAction(loginAction, {
        onSuccess: () => {
            router.push('/');
        },
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onSubmit(data: LoginFormValues) {
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
                    control={form.control}
                    name="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isPending}
                />

                <TextFormField
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
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
