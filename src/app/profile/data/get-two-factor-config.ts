'use server';

import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateTOTPSecret } from '@/lib/two-factor';

export type GetTwoFactorConfigResponse = {
    otpauth: string;
    secret: string;
};

export const getTwoFactorConfig = cache(
    async (userId: string): Promise<GetTwoFactorConfigResponse | undefined> => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            return undefined;
        }

        const { base32, otpauth } = generateTOTPSecret(user.emailAddress);

        await db
            .update(users)
            .set({ twoFactorTempSecret: base32 })
            .where(eq(users.id, userId));

        return { otpauth, secret: base32 };
    }
);
