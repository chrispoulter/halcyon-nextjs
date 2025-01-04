import { Metadata } from 'next';
import { getProfileAction } from '@/app/profile/actions/get-profile-action';
import { UpdateProfileForm } from '@/app/profile/update-profile/update-profile-form';
import { ServerActionError } from '@/components/server-action-error';
import { isServerActionSuccess } from '@/lib/action-types';

export const metadata: Metadata = {
    title: 'Update Profile',
};

export default async function UpdateProfile() {
    const result = await getProfileAction();

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    const profile = result.data;

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Update Profile
            </h1>

            <p className="leading-7">
                Update your personal details below. Your email address is used
                to login to your account.
            </p>

            <UpdateProfileForm profile={profile} />
        </main>
    );
}
