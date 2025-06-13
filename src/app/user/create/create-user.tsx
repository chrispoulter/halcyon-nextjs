'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { createUserAction } from '@/app/user/actions/create-user-action';
import {
    CreateUserForm,
    CreateUserFormValues,
} from '@/app/user/create/create-user-form';
import { Button } from '@/components/ui/button';
import { ServerActionErrorMessage } from '@/components/server-action-error';

export function CreateUser() {
    const router = useRouter();

    const { execute: createUser, isPending: isSaving } = useAction(
        createUserAction,
        {
            onSuccess() {
                toast.success('User successfully created.');
                router.push('/user');
            },
            onError({ error }) {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onSubmit(data: CreateUserFormValues) {
        createUser(data);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Users
            </h1>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Create
            </h2>

            <p className="leading-7">
                Create a new account for a user to access the full range of
                features available on this site.
            </p>

            <CreateUserForm loading={isSaving} onSubmit={onSubmit}>
                <Button asChild variant="outline">
                    <Link href="/user">Cancel</Link>
                </Button>
            </CreateUserForm>
        </main>
    );
}
