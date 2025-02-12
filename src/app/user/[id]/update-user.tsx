'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { updateUserAction } from '@/app/user/actions/update-user-action';
import { lockUserAction } from '@/app/user/actions/lock-user-action';
import { unlockUserAction } from '@/app/user/actions/unlock-user-action';
import { deleteUserAction } from '@/app/user/actions/delete-user-action';
import {
    UpdateUserForm,
    UpdateUserFormValues,
} from '@/app/user/[id]/update-user-form';
import { UnlockUserButton } from '@/app/user/[id]/unlock-user-button';
import { LockUserButton } from '@/app/user/[id]/lock-user-button';
import { DeleteUserButton } from '@/app/user/[id]/delete-user-button';
import { GetUserResponse } from '@/app/user/user-types';
import { ServerActionErrorMessage } from '@/components/server-action-error';

type UpdateUserProps = {
    user: GetUserResponse;
};

export function UpdateUser({ user }: UpdateUserProps) {
    const router = useRouter();

    const { execute: updateUser, isPending: isUpdating } = useAction(
        updateUserAction,
        {
            onSuccess: () => {
                toast.success('User successfully updated.');
                router.push('/user');
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    const { execute: lockUser, isPending: isLocking } = useAction(
        lockUserAction,
        {
            onSuccess: () => {
                toast.success('User successfully locked.');
                router.refresh();
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    const { execute: unlockUser, isPending: isUnlocking } = useAction(
        unlockUserAction,
        {
            onSuccess: () => {
                toast.success('User successfully unlocked.');
                router.refresh();
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    const { execute: deleteUser, isPending: isDeleting } = useAction(
        deleteUserAction,
        {
            onSuccess: () => {
                toast.success('User successfully deleted.');
                router.push('/user');
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
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

    function onLock() {
        lockUser({
            id: user.id,
            version: user.version,
        });
    }

    function onUnlock() {
        unlockUser({
            id: user.id,
            version: user.version,
        });
    }

    function onDelete() {
        deleteUser({
            id: user.id,
            version: user.version,
        });
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
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
                disabled={isLocking || isUnlocking || isDeleting}
                onSubmit={onSubmit}
            >
                {user.isLockedOut ? (
                    <UnlockUserButton
                        loading={isUnlocking}
                        disabled={isUpdating || isLocking || isDeleting}
                        onClick={onUnlock}
                    />
                ) : (
                    <LockUserButton
                        loading={isLocking}
                        disabled={isUpdating || isUnlocking || isDeleting}
                        onClick={onLock}
                    />
                )}

                <DeleteUserButton
                    loading={isDeleting}
                    disabled={isUpdating || isLocking || isUnlocking}
                    onClick={onDelete}
                />
            </UpdateUserForm>
        </main>
    );
}
