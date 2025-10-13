'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { updateUserAction } from '@/app/user/actions/update-user-action';
import {
    UpdateUserForm,
    type UpdateUserFormValues,
} from '@/app/user/[id]/update-user-form';
import { UnlockUserButton } from '@/app/user/[id]/unlock-user-button';
import { LockUserButton } from '@/app/user/[id]/lock-user-button';
import { DeleteUserButton } from '@/app/user/[id]/delete-user-button';
import type { GetUserResponse } from '@/app/user/user-types';
import { Button } from '@/components/ui/button';
import { ServerActionError } from '@/components/server-action-error';

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
                router.push('/user');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(data: UpdateUserFormValues) {
        updateUser({
            ...data,
            id: user.id,
            version: user.version,
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
                    <Link href="/user">Cancel</Link>
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
