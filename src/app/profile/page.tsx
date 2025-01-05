import { Metadata } from 'next';
import Link from 'next/link';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { DeleteAccountButton } from '@/app/profile/delete-account-button';
import { Button } from '@/components/ui/button';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

import { toLocaleString } from '@/lib/dates';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function Profile() {
    const result = await getProfileAction();

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    const profile = result.data;

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                My Account
            </h1>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Personal Details
            </h2>

            <dl className="space-y-2">
                <dt className="text-sm font-medium leading-none">
                    Email Address
                </dt>
                <dd className="truncate text-sm text-muted-foreground">
                    {profile.emailAddress}
                </dd>
                <dt className="text-sm font-medium leading-none">Name</dt>
                <dd className="truncate text-sm text-muted-foreground">
                    {profile.firstName} {profile.lastName}
                </dd>
                <dt className="text-sm font-medium leading-none">
                    Date Of Birth
                </dt>
                <dd className="truncate text-sm text-muted-foreground">
                    {toLocaleString(profile.dateOfBirth)}
                </dd>
            </dl>

            <Button asChild className="w-full min-w-32 sm:w-auto">
                <Link href="/profile/update-profile">Update Profile</Link>
            </Button>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Login Details
            </h2>

            <p className="leading-7">
                Choose a strong password and don&apos;t reuse it for other
                accounts. For security reasons, change your password on a
                regular basis.
            </p>

            <Button asChild className="w-full min-w-32 sm:w-auto">
                <Link href="/profile/change-password">Change Password</Link>
            </Button>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Settings
            </h2>

            <p className="leading-7">
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </p>

            <DeleteAccountButton
                profile={profile}
                className="w-full min-w-32 sm:w-auto"
            />
        </main>
    );
}
