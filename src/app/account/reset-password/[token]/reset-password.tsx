'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { resetPasswordAction } from '@/app/account/actions/reset-password-action';
import {
    ResetPasswordForm,
    type ResetPasswordFormValues,
} from '@/app/account/reset-password/[token]/reset-password-form';
import { ServerActionErrorMessage } from '@/components/server-action-error';

type ResetPasswordProps = {
    token: string;
};

export function ResetPassword({ token }: ResetPasswordProps) {
    const router = useRouter();

    const { execute: resetPassword, isPending: isSaving } = useAction(
        resetPasswordAction,
        {
            onSuccess() {
                toast.success('Your password has been reset.');
                router.push('/account/login');
            },
            onError({ error }) {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onSubmit(data: ResetPasswordFormValues) {
        resetPassword({ ...data, token });
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Reset Password
            </h1>

            <p className="leading-7">
                Reset your password below. Choose a strong password and
                don&apos;t reuse it for other accounts. For security reasons,
                change your password on a regular basis.
            </p>

            <ResetPasswordForm loading={isSaving} onSubmit={onSubmit} />
        </main>
    );
}
