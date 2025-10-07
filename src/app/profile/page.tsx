import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { Profile } from '@/app/profile/profile';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    return <Profile profile={profile} />;
}
