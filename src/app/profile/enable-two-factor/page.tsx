import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTwoFactorConfig } from '@/app/profile/data/get-two-factor-config';
import { EnableTwoFactor } from '@/app/profile/enable-two-factor/enable-two-factor';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Enable Two-Factor Authentication',
};

export default async function Page() {
    const session = await verifySession();

    const configuration = await getTwoFactorConfig(session.sub);

    if (!configuration) {
        notFound();
    }

    return <EnableTwoFactor configuration={configuration} />;
}
