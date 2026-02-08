import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setupTwoFactor } from '@/app/profile/data/setup-two-factor';
import { EnableAuthenticator } from '@/app/profile/enable-authenticator/enable-authenticator';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Configure Authenticator App',
};

export default async function Page() {
    const session = await verifySession();

    const configuration = await setupTwoFactor(session.sub);

    if (!configuration) {
        notFound();
    }

    return <EnableAuthenticator configuration={configuration} />;
}
