import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { DisableTwoFactorButton } from './ui/disable-twofactor-button';
import { ReissueRecoveryCodesButton } from './ui/reissue-recovery-codes-button';

export default async function Page() {
    const session = await getSession();
    if (!session) {
        return (
            <main className="mx-auto max-w-screen-sm space-y-6 p-6">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                    Two Factor Authentication
                </h1>
                <p className="leading-7">
                    You must be signed in to manage two factor authentication.
                </p>
            </main>
        );
    }

    const [user] = await db
        .select({
            id: users.id,
            twoFactorEnabled: users.twoFactorEnabled,
        })
        .from(users)
        .where(eq(users.id, session.sub))
        .limit(1);

    const enabled = !!user?.twoFactorEnabled;

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Two Factor Authentication
            </h1>

            {!enabled ? (
                <div className="space-y-4">
                    <p className="leading-7">
                        Protect your account with a second step when logging in.
                        Enable two factor authentication using an authenticator
                        app like Authy.
                    </p>
                    <Link
                        href="/profile/two-factor/setup"
                        className="underline underline-offset-4"
                    >
                        Enable Two Factor Authentication
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="leading-7">
                        Two factor authentication is currently enabled on your
                        account.
                    </p>
                    <div className="space-y-2">
                        <DisableTwoFactorButton />
                        <ReissueRecoveryCodesButton />
                        <Link
                            href="/profile/two-factor/setup"
                            className="underline underline-offset-4"
                        >
                            Reconfigure Authenticator App
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}
