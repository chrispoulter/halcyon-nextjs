import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { Profile } from '@/app/profile/profile';
import { ensureAuthorized } from '@/lib/permissions';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function ProfilePage() {
    const session = await ensureAuthorized();

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    return <Profile profile={profile} />;
}
