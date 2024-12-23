import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/app/account/login/login-form';

export const metadata: Metadata = {
    title: 'Login',
};

export default async function Login() {
    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Login
            </h1>

            <p className="mt-6 leading-7">
                Enter your email address below to login to your account.
            </p>

            <LoginForm className="mt-6" />

            <p className="mt-6 leading-7">
                Not already a member?{' '}
                <Link
                    href="/account/register"
                    className="font-medium text-primary underline underline-offset-4"
                >
                    Register now
                </Link>{' '}
                <br />
                Forgotten your password?{' '}
                <Link
                    href="/account/forgot-password"
                    className="font-medium text-primary underline underline-offset-4"
                >
                    Request reset
                </Link>
            </p>
        </main>
    );
}
