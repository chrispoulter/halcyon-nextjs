import { Metadata } from 'next';
import Link from 'next/link';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { ChangePasswordForm } from '@/app/profile/change-password/change-password-form';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePassword() {
    const result = await getProfileAction();

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
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
                    className="underline underline-offset-4"
                >
                    Request reset
                </Link>
            </p>
        </main>
    );
}
