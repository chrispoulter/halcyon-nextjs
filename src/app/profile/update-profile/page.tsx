import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { verifySession } from '@/lib/dal';
import { getProfile } from '../data/get-profile';
import { UpdateProfile } from './update-profile';

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
