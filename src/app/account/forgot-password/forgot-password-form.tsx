'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { forgotPasswordAction } from '@/app/actions/forgotPasswordAction';
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
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

type ForgotPasswordFormProps = {
    className?: string;
};

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
    const router = useRouter();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: '',
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
        const result = await forgotPasswordAction(data);

        toast({
            title: 'Instructions as to how to reset your password have been sent to you via email.',
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

                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
