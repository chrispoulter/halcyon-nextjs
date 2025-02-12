'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { forgotPasswordAction } from '@/app/account/actions/forgot-password-action';
import {
    ForgotPasswordForm,
    type ForgotPasswordFormValues,
} from '@/app/account/forgot-password/forgot-password-form';
import { ServerActionErrorMessage } from '@/components/server-action-error';

export function ForgotPassword() {
    const router = useRouter();

    const { execute: forgotPassword, isPending: isSaving } = useAction(
        forgotPasswordAction,
        {
            onSuccess: () => {
                toast.success(
                    'Instructions as to how to reset your password have been sent to you via email.'
                );

                router.push('/account/login');
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onSubmit(data: ForgotPasswordFormValues) {
        forgotPassword(data);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Forgot Password
            </h1>

            <p className="leading-7">
                Request a password reset link by providing your email address.
            </p>

            <ForgotPasswordForm loading={isSaving} onSubmit={onSubmit} />
        </main>
    );
}
