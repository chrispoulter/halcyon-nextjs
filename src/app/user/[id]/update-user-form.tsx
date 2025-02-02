'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { updateUserAction } from '@/app/user/actions/update-user-action';
import { DeleteUserButton } from '@/app/user/[id]/delete-user-button';
import { LockUserButton } from '@/app/user/[id]/lock-user-button';
import { UnlockUserButton } from '@/app/user/[id]/unlock-user-button';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/loading-button';
import { DateFormField } from '@/components/date-form-field';
import { SwitchFormField } from '@/components/switch-form-field';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';
import { isInPast } from '@/lib/dates';
import { Role, roles } from '@/lib/session-types';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
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
});

type UpdateUserFormValues = z.infer<typeof schema>;

type UpdateUserFormProps = {
    user: GetUserResponse;
};

export function UpdateUserForm({ user }: UpdateUserFormProps) {
    const router = useRouter();

    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(schema),
        values: user,
    });

    const { execute, isPending } = useAction(updateUserAction, {
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'User successfully updated.',
            });

            router.push('/user');
        },
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onSubmit(data: UpdateUserFormValues) {
        execute({
            ...data,
            id: user.id,
            version: user.version,
        });
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

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        control={form.control}
                        name="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={isPending}
                        className="flex-1"
                    />
                    <TextFormField
                        control={form.control}
                        name="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={isPending}
                        className="flex-1"
                    />
                </div>

                <DateFormField
                    control={form.control}
                    name="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                    disabled={isPending}
                />

                <SwitchFormField
                    control={form.control}
                    name="roles"
                    options={roles}
                    disabled={isPending}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button asChild variant="outline">
                        <Link href="/user">Cancel</Link>
                    </Button>

                    {user.isLockedOut ? (
                        <UnlockUserButton user={user} />
                    ) : (
                        <LockUserButton user={user} />
                    )}

                    <DeleteUserButton user={user} />

                    <LoadingButton type="submit" loading={isPending}>
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
