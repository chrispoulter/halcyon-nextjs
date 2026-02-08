import { Metadata } from 'next';
import { LoginWithRecoveryCode } from '@/app/account/login-with-recovery-code/login-with-recovery-code';
import { verifyPendingSession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Recovery Code Verification',
};

export default async function Page() {
    await verifyPendingSession();

    return <LoginWithRecoveryCode />;
}
