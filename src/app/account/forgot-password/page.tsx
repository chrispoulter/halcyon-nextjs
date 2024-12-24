import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/app/account/forgot-password/forgot-password-form';

export const metadata: Metadata = {
    title: 'Forgot Password',
};

export default async function ForgotPassword() {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Forgot Password
            </h1>

            <p className="leading-7">
                Request a password reset link by providing your email address.
            </p>

            <ForgotPasswordForm />
        </main>
    );
}
