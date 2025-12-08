import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfile } from '@/app/profile/data/get-profile';
import { setupTwoFactor } from '@/app/profile/data/setup-two-factor';
import { SetupTwoFactor } from '@/app/profile/setup-two-factor/setup-two-factor';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Setup Two-Factor Authentication',
};

export default async function Page() {
    const session = await verifySession();

    const profile = await getProfile(session.sub);

    if (!profile) {
        notFound();
    }

    const configuration = await setupTwoFactor(session.sub);

    if (!configuration) {
        notFound();
    }

    return <SetupTwoFactor configuration={configuration} />;
}
