'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createUserAction } from '@/app/actions/createUserAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DateFormField } from '@/components/date-form-field';
import { RoleFormField } from '@/components/role-form-field';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { Role } from '@/lib/definitions';
import { isInPast } from '@/lib/dates';

const formSchema = z
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
                    message: 'Role must be a valid system role',
                }),
                { message: 'Role must be a valid array' }
            )
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type CreateUserFormValues = z.infer<typeof formSchema>;

export function CreateUserForm() {
    const router = useRouter();

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(formSchema),
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

        toast({
            title: 'User successfully created.',
            description: JSON.stringify(result),
        });

        router.push('/user');
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

                <RoleFormField field="roles" />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button asChild variant="outline">
                        <Link href="/user">Cancel</Link>
                    </Button>

                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
