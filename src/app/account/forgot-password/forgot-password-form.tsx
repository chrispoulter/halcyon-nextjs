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

const formSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .min(1, 'Email Address is a required field')
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
                className="space-y-6"
            >
                <TextFormField
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
