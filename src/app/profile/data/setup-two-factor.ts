'use server';

import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateSecret, generateOtpauth } from '@/lib/two-factor';
import { decryptSecret, encryptSecret } from '@/lib/encrypt';

export type SetupTwoFactorResponse = {
    otpauth: string;
    secret: string;
};

export const setupTwoFactor = cache(
    async (userId: string): Promise<SetupTwoFactorResponse | undefined> => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                isLockedOut: users.isLockedOut,
                twoFactorSecret: users.twoFactorSecret,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            return undefined;
        }

        if (user.twoFactorSecret) {
            const decryptedSecret = decryptSecret(user.twoFactorSecret);
            const otpauth = generateOtpauth(decryptedSecret, user.emailAddress);

            return { otpauth, secret: decryptedSecret };
        }

        const { base32, otpauth } = generateSecret(user.emailAddress);
        const encryptedSecret = encryptSecret(base32);

        await db
            .update(users)
            .set({ twoFactorSecret: encryptedSecret })
            .where(eq(users.id, userId));

        return { otpauth, secret: base32 };
    }
);
