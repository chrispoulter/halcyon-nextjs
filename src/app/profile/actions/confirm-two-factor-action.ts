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

type ConfirmTwoFactorResponse = {
    id: string;
    recoveryCodes: string[];
};

const schema = z.object({
    code:  z
            .string({ message: 'Code must be a valid string' })
            .min(6, 'Code must be at least 6 characters')
            .max(6, 'Code must be no more than 6 characters')
});

export const confirmTwoFactorAction = authActionClient()
    .metadata({ actionName: 'confirmTwoFactorAction' })
    .inputSchema(schema)
    .action<ConfirmTwoFactorResponse>(
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
                    'Two factor authentication configuration not found.'
                );
            }

            const verified = verifyTOTP(
                user.twoFactorTempSecret,
                parsedInput.code
            );

            if (!verified) {
                throw new ActionError('Invalid authenticator code.');
            }

            const recoveryCodes = generateRecoveryCodes(10);

            await db
                .update(users)
                .set({
                    twoFactorEnabled: true,
                    twoFactorSecret: user.twoFactorTempSecret,
                    twoFactorTempSecret: null,
                    twoFactorRecoveryCodes: hashRecoveryCodes(recoveryCodes),
                })
                .where(eq(users.id, userId));

            return { id: user.id, recoveryCodes };
        }
    );
