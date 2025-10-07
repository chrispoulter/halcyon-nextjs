import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { UpdateProfile } from '@/app/profile/update-profile/update-profile';
import { verifySession } from '@/lib/permissions';

export const metadata: Metadata = {
    title: 'Update Profile',
};

export default async function UpdateProfilePage() {
    const session = await verifySession();

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    return <UpdateProfile profile={profile} />;
}
