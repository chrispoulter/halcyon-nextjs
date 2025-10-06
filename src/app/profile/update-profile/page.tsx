import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { UpdateProfile } from '@/app/profile/update-profile/update-profile';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
    title: 'Update Profile',
};

export default async function UpdateProfilePage() {
    const session = await getSession();

    if (!session) {
        return redirect('/account/login');
    }

    const profile = await getProfile(session.sub);

    if (!profile || profile.isLockedOut) {
        return notFound();
    }

    return <UpdateProfile profile={profile} />;
}
