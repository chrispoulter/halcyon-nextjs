import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTwoFactorConfig } from '@/app/profile/data/get-two-factor-config';
import { EnableAuthenticator } from '@/app/profile/enable-authenticator/enable-authenticator';
import { verifySession } from '@/lib/dal';

export const metadata: Metadata = {
    title: 'Configure Authenticator App',
};

export default async function Page() {
    const session = await verifySession();

    const configuration = await getTwoFactorConfig(session.sub);

    if (!configuration) {
        notFound();
    }

    return <EnableAuthenticator configuration={configuration} />;
}
