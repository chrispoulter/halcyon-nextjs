'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginAction } from '@/app/actions/loginAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .min(1, 'Email Address is a required field')
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

type LoginFormValues = z.infer<typeof formSchema>;

type LoginFormProps = {
    className?: string;
};

export function LoginForm({ className }: LoginFormProps) {
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
        const result = await loginAction(data);

        toast({
            title: 'You have been successfully logged in.',
            description: JSON.stringify(result),
        });

        router.push('/');
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

                <TextFormField
                    field="password"
                    label="Password"
                    type="password"
                    maxLength={50}
                    autoComplete="current-password"
                    required
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
