import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { getProfileAction } from '@/app/actions/getProfileAction';
import { DeleteAccountButton } from '@/app/profile/delete-acccount-button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toLocaleString } from '@/lib/dates';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function Profile() {
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
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                My Account
            </h1>

            <h2 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
                Personal Details
            </h2>

            <p className="mt-6 font-semibold leading-7">Email Address</p>
            <p className="leading-7">{profile.emailAddress}</p>

            <p className="mt-6 font-semibold leading-7">Name</p>
            <p className="leading-7">
                {profile.firstName} {profile.lastName}
            </p>

            <p className="mt-6 font-semibold leading-7">Date Of Birth</p>
            <p className="leading-7">{toLocaleString(profile.dateOfBirth)}</p>

            <Button asChild variant="secondary" className="mt-6">
                <Link href="/profile/update-profile">Update Profile</Link>
            </Button>

            <h2 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
                Login Details
            </h2>

            <p className="mt-6 leading-7">
                Choose a strong password and don&apos;t reuse it for other
                accounts. For security reasons, change your password on a
                regular basis.
            </p>

            <Button asChild variant="secondary" className="mt-6">
                <Link href="/profile/change-password">Change Password</Link>
            </Button>

            <h2 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
                Settings
            </h2>

            <p className="mt-6 leading-7">
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </p>

            <DeleteAccountButton className="mt-6" />
        </main>
    );
}
