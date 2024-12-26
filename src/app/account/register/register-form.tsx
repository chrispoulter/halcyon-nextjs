'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerAction } from '@/app/actions/registerAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DateFormField } from '@/components/date-form-field';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { isInPast } from '@/lib/dates';

const formSchema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .min(1, 'Email Address is a required field')
            .max(254, 'Password must be no more than 254 characters')
            .email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password must be a valid string' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z
            .string({
                message: 'Confirm Password is a required field',
            })
            .min(1, 'Confirm Password is a required field'),
        firstName: z
            .string({
                message: 'Confirm Password is a required field',
            })
            .min(1, 'First Name is a required field')
            .max(50, 'First Name must be no more than 50 characters'),
        lastName: z
            .string({ message: 'Last Name must be a valid string' })
            .min(1, 'Last Name is a required field')
            .max(50, 'Last Name must be no more than 50 characters'),
        dateOfBirth: z
            .string({
                message: 'Date of Birth must be a valid string',
            })
            .min(1, 'Date Of Birth is a required field')
            .date('Date Of Birth must be a valid date')
            .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
    const router = useRouter();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
        },
    });

    async function onSubmit(data: RegisterFormValues) {
        const result = await registerAction(data);

        toast({
            title: 'User successfully registered.',
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

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        field="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        className="flex-1"
                    />
                    <TextFormField
                        field="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        className="flex-1"
                    />
                </div>

                <DateFormField
                    field="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
