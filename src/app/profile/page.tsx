import type { Metadata } from 'next';
import { getProfile } from '@/app/profile/data/get-profile';
import { Profile } from '@/app/profile/profile';

export const metadata: Metadata = {
    title: 'My Account',
};

export default async function ProfilePage() {
    const profile = await getProfile();
    return <Profile profile={profile} />;
}
