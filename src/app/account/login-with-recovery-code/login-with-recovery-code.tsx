'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { loginWithRecoveryCodeAction } from '@/app/account/actions/login-with-recovery-code-action';
import {
    LoginWithRecoveryCodeForm,
    LoginWithRecoveryCodeFormValues,
} from '@/app/account/login-with-recovery-code/login-with-recovery-code-form';
import { ServerActionError } from '@/components/server-action-error';
import { Button } from '@/components/ui/button';

export function LoginWithRecoveryCode() {
    const router = useRouter();

    const { execute: loginWithRecoveryCode, isPending: isSaving } = useAction(
        loginWithRecoveryCodeAction,
        {
            onSuccess() {
                router.push('/');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: LoginWithRecoveryCodeFormValues) {
        loginWithRecoveryCode(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Recovery Code Verification
            </h1>

            <p className="leading-7">
                You have requested to login using a recovery code. Please enter
                one of your recovery codes below.
            </p>

            <LoginWithRecoveryCodeForm loading={isSaving} onSubmit={onSubmit}>
                <Button asChild variant="outline">
                    <Link href="/account/login-with-two-factor">Cancel</Link>
                </Button>
            </LoginWithRecoveryCodeForm>
        </main>
    );
}
