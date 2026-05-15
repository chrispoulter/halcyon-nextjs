import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { verifySession } from '@/lib/dal';
import { getProfile } from './data/get-profile';
import { Profile } from './profile';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function ProfilePage() {
    const session = await verifySession();

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    return <Profile profile={profile} />;
}
