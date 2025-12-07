'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { actionClient, ActionError } from '@/lib/safe-action';
import { getSession } from '@/lib/session';

export const disableTwoFactorAction = actionClient
    .metadata({ actionName: 'disableTwoFactorAction' })
    .action(async () => {
        const session = await getSession();

        if (!session) {
            throw new ActionError(
                'You must be signed in to disable two-factor authentication'
            );
        }

        await db
            .update(users)
            .set({
                twoFactorEnabled: false,
                twoFactorSecret: null,
                twoFactorTempSecret: null,
                twoFactorRecoveryCodes: null,
            })
            .where(eq(users.id, session.sub));

        return { success: true };
    });
