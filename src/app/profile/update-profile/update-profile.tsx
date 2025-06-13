'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { updateProfileAction } from '@/app/profile/actions/update-profile-action';
import {
    UpdateProfileForm,
    UpdateProfileFormValues,
} from '@/app/profile/update-profile/update-profile-form';
import { GetProfileResponse } from '@/app/profile/profile-types';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { Button } from '@/components/ui/button';

type ProfileProps = {
    profile: GetProfileResponse;
};

export function UpdateProfile({ profile }: ProfileProps) {
    const router = useRouter();

    const { execute: updateProfile, isPending: isSaving } = useAction(
        updateProfileAction,
        {
            onSuccess() {
                toast.success('Your profile has been updated.');
                router.push('/profile');
            },
            onError({ error }) {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onSubmit(data: UpdateProfileFormValues) {
        updateProfile({
            ...data,
            version: profile.version,
        });
    }
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Update Profile
            </h1>

            <p className="leading-7">
                Update your personal details below. Your email address is used
                to login to your account.
            </p>

            <UpdateProfileForm
                values={profile}
                loading={isSaving}
                onSubmit={onSubmit}
            >
                <Button asChild variant="outline">
                    <Link href="/profile">Cancel</Link>
                </Button>
            </UpdateProfileForm>
        </main>
    );
}
