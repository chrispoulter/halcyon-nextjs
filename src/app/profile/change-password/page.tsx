import type { Metadata } from 'next';
import { verifySession } from '@/lib/dal';
import { ChangePassword } from './change-password';

export const metadata: Metadata = {
    title: 'Change Password',
};

export default async function ChangePasswordPage() {
    await verifySession();

    return <ChangePassword />;
}
