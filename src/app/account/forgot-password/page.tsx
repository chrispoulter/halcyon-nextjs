import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/app/account/forgot-password/forgot-password-form';

export const metadata: Metadata = {
    title: 'Forgot Password',
};

export default async function ForgotPassword() {
    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Forgot Password
            </h1>

            <p className="mt-6 leading-7">
                Request a password reset link by providing your email address.
            </p>

            <ForgotPasswordForm className="mt-6" />
        </main>
    );
}
