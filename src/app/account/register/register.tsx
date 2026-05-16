'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { ServerActionError } from '@/components/server-action-error';
import { registerAction } from '../account-actions';
import { RegisterForm, type RegisterFormValues } from './register-form';

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

            <p className="text-sm text-muted-foreground">
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
