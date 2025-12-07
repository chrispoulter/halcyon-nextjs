'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { actionClient, ActionError } from '@/lib/safe-action';
import { getSession } from '@/lib/session';
import { generateRecoveryCodes, hashRecoveryCodes } from '@/lib/two-factor';

export const generateRecoveryCodesAction = actionClient
    .metadata({ actionName: 'generateRecoveryCodesAction' })
    .action(async () => {
        const session = await getSession();

        if (!session) {
            throw new ActionError(
                'You must be signed in to reissue recovery codes'
            );
        }

        const recoveryCodes = generateRecoveryCodes(10);

        await db
            .update(users)
            .set({ twoFactorRecoveryCodes: hashRecoveryCodes(recoveryCodes) })
            .where(eq(users.id, session.sub));

        return { recoveryCodes };
    });
