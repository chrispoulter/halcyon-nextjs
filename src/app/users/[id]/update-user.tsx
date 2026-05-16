'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ServerActionError } from '@/components/server-action-error';
import { updateUserAction } from '../users-actions';
import type { GetUserResponse } from '../users-data';
import { UpdateUserForm, type UpdateUserFormValues } from './update-user-form';
import { UnlockUserButton } from './unlock-user-button';
import { LockUserButton } from './lock-user-button';
import { DeleteUserButton } from './delete-user-button';

type UpdateUserProps = {
    user: GetUserResponse;
};

export function UpdateUser({ user }: UpdateUserProps) {
    const router = useRouter();

    const { execute: updateUser, isPending: isUpdating } = useAction(
        updateUserAction,
        {
            onSuccess() {
                toast.success('User successfully updated.');
                router.push('/users');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: UpdateUserFormValues) {
        updateUser({
            ...values,
            id: user.id,
        });
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                User
            </h1>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Update
            </h2>

            <p className="leading-7">
                Update the user&apos;s details below. The email address is used
                to login to the account.
            </p>

            <UpdateUserForm
                user={user}
                loading={isUpdating}
                onSubmit={onSubmit}
            >
                <Button asChild variant="outline">
                    <Link href="/users">Cancel</Link>
                </Button>

                {user.isLockedOut ? (
                    <UnlockUserButton user={user} />
                ) : (
                    <LockUserButton user={user} />
                )}

                <DeleteUserButton user={user} />
            </UpdateUserForm>
        </main>
    );
}
