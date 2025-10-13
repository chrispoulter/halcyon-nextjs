import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { ChangePassword } from '@/app/profile/change-password/change-password';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage() {
    const session = await verifySession();

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    return <ChangePassword profile={profile} />;
}
