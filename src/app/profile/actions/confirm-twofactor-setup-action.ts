'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { actionClient, ActionError } from '@/lib/safe-action';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import {
    generateRecoveryCodes,
    hashRecoveryCodes,
    verifyTOTP,
} from '@/lib/twofactor';

const schema = z.object({
    code: z.string().min(6).max(6),
});

export const confirmTwoFactorSetupAction = actionClient
    .metadata({ actionName: 'confirmTwoFactorSetupAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput }) => {
        const session = await getSession();

        if (!session) {
            throw new ActionError('You must be signed in to configure 2FA');
        }

        const [user] = await db
            .select({ id: users.id, tempSecret: users.twoFactorTempSecret })
            .from(users)
            .where(eq(users.id, session.sub))
            .limit(1);

        if (!user || !user.tempSecret) {
            throw new ActionError(
                'Two factor secret not found. Start setup again.'
            );
        }

        const ok = verifyTOTP(user.tempSecret, parsedInput.code);

        if (!ok) {
            throw new ActionError('Invalid authenticator code.');
        }

        const recoveryCodes = generateRecoveryCodes(10);

        await db
            .update(users)
            .set({
                twoFactorEnabled: true,
                twoFactorSecret: user.tempSecret,
                twoFactorTempSecret: null,
                twoFactorRecoveryCodes: hashRecoveryCodes(recoveryCodes),
            })
            .where(eq(users.id, session.sub));

        return { recoveryCodes };
    });
