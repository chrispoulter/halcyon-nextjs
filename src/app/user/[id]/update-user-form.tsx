'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { GetUserResponse } from '@/app/user/user-types';
import { updateUserAction } from '@/app/user/actions/update-user-action';
import { deleteUserAction } from '@/app/user/actions/delete-user-action';
import { lockUserAction } from '@/app/user/actions/lock-user-action';
import { unlockUserAction } from '@/app/user/actions/unlock-user-action';
import { DeleteUserButton } from '@/app/user/[id]/delete-user-button';
import { LockUserButton } from '@/app/user/[id]/lock-user-button';
import { UnlockUserButton } from '@/app/user/[id]/unlock-user-button';
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

    async function onSubmit(data: UpdateUserFormValues) {
        const result = await updateUserAction({ ...data, id: user.id });

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
            description: 'User successfully updated.',
        });

        router.push('/user');
    }

    const [isDeleting, startDeleting] = useTransition();

    async function onDelete() {
        startDeleting(async () => {
            const result = await deleteUserAction({ id: user.id });

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
                description: 'User successfully deleted.',
            });

            router.push('/user');
        });
    }

    const [isLocking, startLocking] = useTransition();

    async function onLock() {
        startLocking(async () => {
            const result = await lockUserAction({ id: user.id });

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
                description: 'User successfully locked.',
            });

            router.refresh();
        });
    }

    const [isUnlocking, startUnlocking] = useTransition();

    async function onUnlock() {
        startUnlocking(async () => {
            const result = await unlockUserAction({ id: user.id });

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
                description: 'User successfully locked.',
            });

            router.refresh();
        });
    }

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField<UpdateUserFormValues>
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={
                        isSubmitting || isDeleting || isLocking || isUnlocking
                    }
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField<UpdateUserFormValues>
                        field="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={
                            isSubmitting ||
                            isDeleting ||
                            isLocking ||
                            isUnlocking
                        }
                        className="flex-1"
                    />
                    <TextFormField<UpdateUserFormValues>
                        field="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={
                            isSubmitting ||
                            isDeleting ||
                            isLocking ||
                            isUnlocking
                        }
                        className="flex-1"
                    />
                </div>

                <DateFormField<UpdateUserFormValues>
                    field="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                    disabled={
                        isSubmitting || isDeleting || isLocking || isUnlocking
                    }
                />

                <SwitchFormField<UpdateUserFormValues>
                    field="roles"
                    options={roles}
                    disabled={
                        isSubmitting || isDeleting || isLocking || isUnlocking
                    }
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button asChild variant="outline" className="min-w-32">
                        <Link href="/user">Cancel</Link>
                    </Button>

                    {user.isLockedOut ? (
                        <UnlockUserButton
                            onUnlock={onUnlock}
                            loading={isUnlocking}
                            disabled={isSubmitting || isDeleting || isLocking}
                            className="min-w-32"
                        />
                    ) : (
                        <LockUserButton
                            onLock={onLock}
                            loading={isLocking}
                            disabled={isSubmitting || isDeleting || isUnlocking}
                            className="min-w-32"
                        />
                    )}

                    <DeleteUserButton
                        onDelete={onDelete}
                        loading={isDeleting}
                        disabled={isSubmitting || isLocking || isUnlocking}
                        className="min-w-32"
                    />

                    <Button
                        type="submit"
                        disabled={isDeleting || isLocking || isUnlocking}
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
