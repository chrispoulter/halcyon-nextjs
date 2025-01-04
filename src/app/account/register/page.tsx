import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/app/account/register/register-form';

export const metadata: Metadata = {
    title: 'Register',
};

export default async function Register() {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Register
            </h1>

            <p className="leading-7">
                Register for a new account to access the full range of features
                available on this site.
            </p>

            <RegisterForm />

            <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    href="/account/login"
                    className="underline underline-offset-4"
                >
                    Log in now
                </Link>
            </p>
        </main>
    );
}
