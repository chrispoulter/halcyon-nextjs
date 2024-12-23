import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/app/account/register/register-form';

export const metadata: Metadata = {
    title: 'Register',
};

export default async function Register() {
    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Register
            </h1>

            <p className="mt-6 leading-7">
                Register for a new account to access the full range of features
                available on this site.
            </p>

            <RegisterForm className="mt-6" />

            <p className="mt-6 leading-7">
                Already have an account?{' '}
                <Link
                    href="/account/login"
                    className="font-medium text-primary underline underline-offset-4"
                >
                    Log in now
                </Link>
            </p>
        </main>
    );
}
