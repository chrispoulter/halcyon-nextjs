'use server';

import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateQRCodeDataUrl, generateTOTPSecret } from '@/lib/two-factor';

export type GetTwoFactorConfigResponse = {
    otpauthUri: string;
    secret: string;
};

export const getTwoFactorConfig = cache(async (userId: string) => {
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
    const otpauthUri = await generateQRCodeDataUrl(otpauth);

    await db
        .update(users)
        .set({ twoFactorTempSecret: base32 })
        .where(eq(users.id, userId));

    return { otpauthUri, secret: base32 };
});
