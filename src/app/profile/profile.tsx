'use client';

import Link from 'next/link';
import type { GetProfileResponse } from '@/app/profile/data/get-profile';
import { DeleteAccountButton } from '@/app/profile/delete-account-button';
import { Button } from '@/components/ui/button';
import { toDisplay } from '@/lib/dates';
import { DisableTwoFactorButton } from './disable-two-factor-button';
import { GenerateRecoveryCodesButton } from './generate-recovery-codes-button';

type ProfileProps = {
    profile: GetProfileResponse;
};

export function Profile({ profile }: ProfileProps) {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                My Account
            </h1>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Personal Details
            </h2>

            <dl className="space-y-2">
                <dt className="text-sm leading-none font-medium">
                    Email Address
                </dt>
                <dd className="text-muted-foreground truncate text-sm">
                    {profile.emailAddress}
                </dd>
                <dt className="text-sm leading-none font-medium">Name</dt>
                <dd className="text-muted-foreground truncate text-sm">
                    {profile.firstName} {profile.lastName}
                </dd>
                <dt className="text-sm leading-none font-medium">
                    Date Of Birth
                </dt>
                <dd className="text-muted-foreground truncate text-sm">
                    {toDisplay(profile.dateOfBirth)}
                </dd>
            </dl>

            <Button asChild className="w-full sm:w-auto">
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

            <Button asChild className="w-full sm:w-auto">
                <Link href="/profile/change-password">Change Password</Link>
            </Button>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Two Factor Authentication
            </h2>

            <p className="leading-7">
                Protect your account with a second step when logging in. Enable
                two factor authentication using an authenticator app like Authy.
            </p>

            {profile.twoFactorEnabled ? (
                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <DisableTwoFactorButton />
                    <GenerateRecoveryCodesButton />
                    <Button asChild>
                        <Link href="/profile/two-factor">
                            Reconfigure Authenticator App
                        </Link>
                    </Button>
                </div>
            ) : (
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/profile/two-factor">
                        Enable Two Factor Authentication
                    </Link>
                </Button>
            )}

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Settings
            </h2>

            <p className="leading-7">
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </p>

            <DeleteAccountButton className="w-full sm:w-auto" />
        </main>
    );
}
