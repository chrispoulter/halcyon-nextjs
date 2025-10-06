import type { Metadata } from 'next';
import { getProfile } from '@/app/profile/data/get-profile';
import { UpdateProfile } from '@/app/profile/update-profile/update-profile';

export const metadata: Metadata = {
    title: 'Update Profile',
};

export default async function UpdateProfilePage() {
    const profile = await getProfile();
    return <UpdateProfile profile={profile} />;
}
