import { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import { getProfileAction } from '@/app/actions/getProfileAction';
import { UpdateProfileForm } from '@/app/profile/update-profile/update-profile-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
    title: 'Update Profile',
};

export default async function UpdateProfile() {
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
                Update Profile
            </h1>

            <p className="mt-6 leading-7">
                Update your personal details below. Your email address is used
                to login to your account.
            </p>

            <UpdateProfileForm profile={profile} className="mt-6" />
        </main>
    );
}
