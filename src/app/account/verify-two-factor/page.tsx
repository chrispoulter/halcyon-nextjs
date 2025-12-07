import { Metadata } from 'next';
import { VerifyTwoFactor } from '@/app/account/verify-two-factor/verify-two-factor';

export const metadata: Metadata = {
    title: 'Verify Two Factor Authentication',
};

export default function Page() {
    return <VerifyTwoFactor />;
}
