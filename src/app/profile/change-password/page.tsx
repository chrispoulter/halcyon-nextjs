import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { ChangePasswordForm } from '@/app/profile/change-password/change-password-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePassword() {
    const result = await getProfileAction();

    if (!result?.data) {
        return (
            <main className="mx-auto max-w-screen-sm p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(result)}
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    const profile = result.data;

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

            <ChangePasswordForm profile={profile} />

            <p className="text-sm text-muted-foreground">
                Forgotten your password?{' '}
                <Link
                    href="/account/forgot-password"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Request reset
                </Link>
            </p>
        </main>
    );
}
