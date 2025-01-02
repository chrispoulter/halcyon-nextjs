'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { createUserAction } from '@/app/user/actions/create-user-action';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DateFormField } from '@/components/date-form-field';
import { SwitchFormField } from '@/components/switch-form-field';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';
import { isServerActionSuccess } from '@/lib/action-types';
import { isInPast } from '@/lib/dates';
import { Role, roles } from '@/lib/session-types';

const schema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password must be a valid string' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z
            .string({
                message: 'Confirm Password must be a valid string',
            })
            .min(1, 'Confirm Password is a required field'),
        firstName: z
            .string({ message: 'First Name must be a valid string' })
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
            .date('Date Of Birth must be a valid date')
            .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
        roles: z
            .array(
                z.nativeEnum(Role, {
                    message: 'Role must be a valid user role',
                }),
                { message: 'Role must be a valid array' }
            )
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type CreateUserFormValues = z.infer<typeof schema>;

export function CreateUserForm() {
    const router = useRouter();

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            roles: [],
        },
    });

    async function onSubmit(data: CreateUserFormValues) {
        const result = await createUserAction(data);

        if (!isServerActionSuccess(result)) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={result} />,
            });

            return;
        }

        toast({
            title: 'Success',
            description: 'User successfully created.',
        });

        router.push('/user');
    }

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField<CreateUserFormValues>
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField<CreateUserFormValues>
                        field="password"
                        label="Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                    <TextFormField<CreateUserFormValues>
                        field="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        maxLength={50}
                        autoComplete="new-password"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                </div>

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField<CreateUserFormValues>
                        field="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                    <TextFormField<CreateUserFormValues>
                        field="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                </div>

                <DateFormField<CreateUserFormValues>
                    field="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                    disabled={isSubmitting}
                />

                <SwitchFormField<CreateUserFormValues>
                    field="roles"
                    options={roles}
                    disabled={isSubmitting}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button asChild variant="outline">
                        <Link href="/user" className="min-w-32">
                            Cancel
                        </Link>
                    </Button>

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
