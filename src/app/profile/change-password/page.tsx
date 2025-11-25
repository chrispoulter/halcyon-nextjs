import type { Metadata } from 'next';
import { ChangePassword } from '@/app/profile/change-password/change-password';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage() {
    await verifySession();

    return <ChangePassword />;
}
