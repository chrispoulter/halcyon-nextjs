import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { setupTwoFactor } from '@/app/profile/data/setup-two-factor';
import { TwoFactor } from '@/app/profile/two-factor/two-factor';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Two Factor Authentication',
};

export default async function Page() {
    const session = await verifySession();

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    const twoFactorSetup = await setupTwoFactor(session.sub);

    if (!twoFactorSetup) {
        notFound();
    }

    return <TwoFactor twoFactorSetup={twoFactorSetup} />;
}
