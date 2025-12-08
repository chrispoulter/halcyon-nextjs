'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { verifyTwoFactorAction } from '@/app/account/actions/login-with-two-factor-action';
import {
    VerifyTwoFactorForm,
    VerifyTwoFactorFormValues,
} from '@/app/account//verify-two-factor/verify-two-factor-form';
import { ServerActionError } from '@/components/server-action-error';

export function VerifyTwoFactor() {
    const router = useRouter();

    const { execute: verifyTwoFactor, isPending: isSaving } = useAction(
        verifyTwoFactorAction,
        {
            onSuccess() {
                router.push('/');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: VerifyTwoFactorFormValues) {
        verifyTwoFactor(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Two Factor Verification
            </h1>
            <p className="leading-7">
                Enter your 6-digit code from your authenticator app. If you
                cannot access your app, enter a recovery code.
            </p>

            <VerifyTwoFactorForm loading={isSaving} onSubmit={onSubmit} />
        </main>
    );
}
