'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GetUserResponse } from '@/app/actions/getUserAction';
import { updateUserAction } from '@/app/actions/updateUserAction';
import { DeleteUserButton } from '@/app/user/[id]/delete-user-button';
import { LockUserButton } from '@/app/user/[id]/lock-user-button';
import { UnlockUserButton } from '@/app/user/[id]/unlock-user-button';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DateFormField } from '@/components/date-form-field';
import { RoleFormField } from '@/components/role-form-field';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { isInPast } from '@/lib/dates';
import { Role } from '@/lib/definitions';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .min(1, 'Email Address is a required field')
        .max(254, 'Password must be no more than 254 characters')
        .email('Email Address must be a valid email'),
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
    roles: z
        .array(
            z.nativeEnum(Role, {
                message: 'Role must be a valid system role',
            }),
            { message: 'Role must be a valid array' }
        )
        .optional(),
});

type UpdateUserFormValues = z.infer<typeof formSchema>;

type UpdateUserFormProps = {
    user: GetUserResponse;
    className?: string;
};

export function UpdateUserForm({ user, className }: UpdateUserFormProps) {
    const router = useRouter();

    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(formSchema),
        values: user,
    });

    async function onSubmit(data: UpdateUserFormValues) {
        const result = await updateUserAction({ ...data, id: user.id });

        toast({
            title: 'User successfully updated.',
            description: JSON.stringify(result),
        });

        router.push('/user');
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
                    autoComplete="bday"
                    required
                />

                <RoleFormField field="roles" />

                <Button asChild variant="secondary" className="w-full">
                    <Link href="/user">Cancel</Link>
                </Button>

                {user.isLockedOut ? (
                    <UnlockUserButton user={user} className="w-full" />
                ) : (
                    <LockUserButton user={user} className="w-full" />
                )}

                <DeleteUserButton user={user} className="w-full" />

                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
