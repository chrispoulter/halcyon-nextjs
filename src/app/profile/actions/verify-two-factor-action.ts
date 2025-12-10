'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { authActionClient, ActionError } from '@/lib/safe-action';
import {
    generateRecoveryCodes,
    hashRecoveryCodes,
    verifyTOTP,
} from '@/lib/two-factor';

type VerifyTwoFactorResponse = {
    id: string;
    recoveryCodes: string[];
};

const schema = z.object({
    verificationCode: z
        .string({ message: 'Verification Code must be a valid string' })
        .regex(/^[0-9]{6}$/, 'Verification Code is not in the correct format'),
});

export const verifyTwoFactorAction = authActionClient()
    .metadata({ actionName: 'verifyTwoFactorAction' })
    .inputSchema(schema)
    .action<VerifyTwoFactorResponse>(
        async ({ parsedInput, ctx: { userId } }) => {
            const [user] = await db
                .select({
                    id: users.id,
                    isLockedOut: users.isLockedOut,
                    twoFactorTempSecret: users.twoFactorTempSecret,
                })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user || user.isLockedOut) {
                throw new ActionError('User not found.', 404);
            }

            if (!user.twoFactorTempSecret) {
                throw new ActionError(
                    'Two-factor authentication is not configured.'
                );
            }

            const verified = verifyTOTP(
                user.twoFactorTempSecret,
                parsedInput.verificationCode
            );

            if (!verified) {
                throw new ActionError('Invalid verification code.');
            }

            const recoveryCodes = generateRecoveryCodes(10);
            const hashedRecoveryCodes = await hashRecoveryCodes(recoveryCodes);

            await db
                .update(users)
                .set({
                    isTwoFactorEnabled: true,
                    twoFactorSecret: user.twoFactorTempSecret,
                    twoFactorTempSecret: null,
                    twoFactorRecoveryCodes: hashedRecoveryCodes,
                })
                .where(eq(users.id, userId));

            return { id: user.id, recoveryCodes };
        }
    );
