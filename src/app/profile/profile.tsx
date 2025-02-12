'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { deleteAccountAction } from '@/app/profile/actions/delete-account-action';
import { DeleteAccountButton } from '@/app/profile/delete-account-button';
import { GetProfileResponse } from '@/app/profile/profile-types';
import { Button } from '@/components/ui/button';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toLocaleString } from '@/lib/dates';

type ProfileProps = {
    profile: GetProfileResponse;
};

export default function Profile({ profile }: ProfileProps) {
    const router = useRouter();

    const { execute: deleteAccount, isPending: isDeleting } = useAction(
        deleteAccountAction,
        {
            onSuccess: () => {
                toast.success('Your account has been deleted.');
                router.push('/');
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onDelete() {
        deleteAccount({
            version: profile.version,
        });
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
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
                    {toLocaleString(profile.dateOfBirth)}
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
                Settings
            </h2>

            <p className="leading-7">
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </p>

            <DeleteAccountButton
                loading={isDeleting}
                onClick={onDelete}
                className="w-full sm:w-auto"
            />
        </main>
    );
}
