import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { getProfileAction } from '@/app/actions/getProfileAction';
import { ChangePasswordForm } from '@/app/profile/change-password/change-password-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePassword() {
    const profile = await getProfileAction();

    if ('errors' in profile) {
        return (
            <main className="mx-auto max-w-screen-sm p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(profile.errors)}
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Change Password
            </h1>

            <p className="leading-7">
                Change your password below. Choose a strong password and
                don&apos;t reuse it for other accounts. For security reasons,
                change your password on a regular basis.
            </p>

            <ChangePasswordForm />

            <p className="leading-7">
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
