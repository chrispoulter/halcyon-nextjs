import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/app/account/login/login-form';

export const metadata: Metadata = {
    title: 'Login',
};

export default async function Login() {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Login
            </h1>

            <p className="leading-7">
                Enter your email address below to login to your account.
            </p>

            <LoginForm />

            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    Not already a member?{' '}
                    <Link
                        href="/account/register"
                        className="underline underline-offset-4"
                    >
                        Register now
                    </Link>
                </p>
                <p className="text-sm text-muted-foreground">
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
