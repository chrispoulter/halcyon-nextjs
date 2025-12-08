import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTwoFactorConfig } from '@/app/profile/data/get-two-factor-config';
import { TwoFactor } from '@/app/profile/two-factor/two-factor';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Two-Factor Authentication',
};

export default async function Page() {
    const session = await verifySession();

    const configuration = await getTwoFactorConfig(session.sub);

    if (!configuration) {
        notFound();
    }

    return <TwoFactor configuration={configuration} />;
}
