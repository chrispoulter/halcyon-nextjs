import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { ChangePassword } from '@/app/profile/change-password/change-password';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage() {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    return <ChangePassword profile={profile} />;
}
