'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { registerAction } from '@/app/account/actions/register-action';
import {
    RegisterForm,
    type RegisterFormValues,
} from '@/app/account/register/register-form';
import { ServerActionError } from '@/components/server-action-error';

export function Register() {
    const router = useRouter();

    const { execute: register, isPending: isSaving } = useAction(
        registerAction,
        {
            onSuccess() {
                toast.success('User successfully registered.');
                router.push('/account/login');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: RegisterFormValues) {
        register(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Register
            </h1>

            <p className="leading-7">
                Register for a new account to access the full range of features
                available on this site.
            </p>

            <RegisterForm loading={isSaving} onSubmit={onSubmit} />

            <p className="text-muted-foreground text-sm">
                Already have an account?{' '}
                <Link
                    href="/account/login"
                    className="underline underline-offset-4"
                >
                    Log in now
                </Link>
            </p>
        </main>
    );
}
