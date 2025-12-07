'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { authActionClient, ActionError } from '@/lib/safe-action';
import { generateQRCodeDataUrl, generateTOTPSecret } from '@/lib/two-factor';

type SetupTwoFactorResponse = {
    id: string;
    qr: string;
    secret: string;
};

export const setupTwoFactorAction = authActionClient()
    .metadata({ actionName: 'setupTwoFactorAction' })
    .action<SetupTwoFactorResponse>(async ({ ctx: { userId } }) => {
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
            throw new ActionError('User not found.', 404);
        }

        const { base32, otpauth } = generateTOTPSecret(user.emailAddress);
        const qr = await generateQRCodeDataUrl(otpauth);

        await db
            .update(users)
            .set({ twoFactorTempSecret: base32 })
            .where(eq(users.id, userId));

        return { id: user.id, qr, secret: base32 };
    });
