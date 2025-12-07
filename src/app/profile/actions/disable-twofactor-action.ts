'use server';

import { eq } from 'drizzle-orm';
import { actionClient, ActionError } from '@/lib/safe-action';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users } from '@/db/schema/users';

export const disableTwoFactorAction = actionClient
    .metadata({ actionName: 'disableTwoFactorAction' })
    .action(async () => {
        const session = await getSession();
        
        if (!session) {
            throw new ActionError('You must be signed in to disable 2FA');
        }

        await db
            .update(users)
            .set({
                twoFactorEnabled: false,
                twoFactorSecret: null,
                twoFactorRecoveryCodes: null,
            })
            .where(eq(users.id, session.sub));

        return { success: true };
    });
