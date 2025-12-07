'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { authActionClient, ActionError } from '@/lib/safe-action';
import { generateRecoveryCodes, hashRecoveryCodes } from '@/lib/two-factor';

type GenerateRecoveryCodesResponse = {
    id: string;
    recoveryCodes: string[];
};

export const generateRecoveryCodesAction = authActionClient()
    .metadata({ actionName: 'generateRecoveryCodesAction' })
    .action<GenerateRecoveryCodesResponse>(async ({ ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                isLockedOut: users.isLockedOut,
                twofactorEnabled: users.twoFactorEnabled,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        if (!user.twofactorEnabled) {
            throw new ActionError('Two factor authentication is not enabled.');
        }

        const recoveryCodes = generateRecoveryCodes(10);

        await db
            .update(users)
            .set({ twoFactorRecoveryCodes: hashRecoveryCodes(recoveryCodes) })
            .where(eq(users.id, userId));

        return { id: user.id, recoveryCodes };
    });
