import type { Metadata } from 'next';
import { getProfile } from '@/app/profile/data/get-profile';
import { ChangePassword } from '@/app/profile/change-password/change-password';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage() {
    const profile = await getProfile();
    return <ChangePassword profile={profile} />;
}
