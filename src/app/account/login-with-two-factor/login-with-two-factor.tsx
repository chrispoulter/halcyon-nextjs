'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { loginWithTwoFactorAction } from '@/app/account/actions/login-with-two-factor-action';
import {
    LoginWithTwoFactorForm,
    LoginWithTwoFactorFormValues,
} from '@/app/account/login-with-two-factor/login-with-two-factor-form';
import { ServerActionError } from '@/components/server-action-error';
import { Button } from '@/components/ui/button';

export function LoginWithTwoFactor() {
    const router = useRouter();

    const { execute: loginWithTwoFactor, isPending: isSaving } = useAction(
        loginWithTwoFactorAction,
        {
            onSuccess() {
                router.push('/');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: LoginWithTwoFactorFormValues) {
        loginWithTwoFactor(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Two-Factor Authentication
            </h1>

            <p className="leading-7">
                Your login is protected with an authenticator app. Enter your
                authenticator code below.
            </p>

            <LoginWithTwoFactorForm loading={isSaving} onSubmit={onSubmit}>
                <Button asChild variant="outline">
                    <Link href="/account/login">Cancel</Link>
                </Button>
            </LoginWithTwoFactorForm>

            <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                    Don&apos;t have access to your authenticator device? You can{' '}
                    <Link
                        href="/account/login-with-recovery-code"
                        className="underline underline-offset-4"
                    >
                        login with a recovery code
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}
