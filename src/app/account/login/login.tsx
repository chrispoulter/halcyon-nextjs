'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { loginAction } from '@/app/account/actions/login-action';
import {
    LoginForm,
    type LoginFormValues,
} from '@/app/account/login/login-form';
import { ServerActionError } from '@/components/server-action-error';

export function Login() {
    const router = useRouter();

    const { execute: login, isPending: isSaving } = useAction(loginAction, {
        onSuccess({ data }) {
            if (data?.requires2fa) {
                router.push('/account/verify-two-factor');
                return;
            }

            router.push('/');
        },
        onError({ error }) {
            toast.error(<ServerActionError result={error} />);
        },
    });

    function onSubmit(values: LoginFormValues) {
        login(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Login
            </h1>

            <p className="leading-7">
                Enter your email address below to login to your account.
            </p>

            <LoginForm loading={isSaving} onSubmit={onSubmit} />

            <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                    Not already a member?{' '}
                    <Link
                        href="/account/register"
                        className="underline underline-offset-4"
                    >
                        Register now
                    </Link>
                </p>
                <p className="text-muted-foreground text-sm">
                    Forgotten your password?{' '}
                    <Link
                        href="/account/forgot-password"
                        className="underline underline-offset-4"
                    >
                        Request reset
                    </Link>
                </p>
            </div>
        </main>
    );
}
