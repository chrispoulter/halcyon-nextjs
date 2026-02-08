import { Metadata } from 'next';
import { LoginWithTwoFactor } from '@/app/account/login-with-two-factor/login-with-two-factor';
import { verifyPendingSession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Two-Factor Authentication',
};

export default async function Page() {
    await verifyPendingSession();

    return <LoginWithTwoFactor />;
}
