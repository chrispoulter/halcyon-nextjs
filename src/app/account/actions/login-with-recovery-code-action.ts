'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { actionClient, ActionError } from '@/lib/safe-action';
import {
    createSession,
    deletePendingSession,
    getPendingSession,
} from '@/lib/session';
import type { Role } from '@/lib/definitions';
import { verifyHash } from '@/lib/hash';

const schema = z.object({
    recoveryCode: z
        .string({ message: 'Recovery Code must be a valid string' })
        .regex(/^[A-F0-9]{10}$/, 'Recovery Code is not in the correct format'),
});

export const loginWithRecoveryCodeAction = actionClient
    .metadata({ actionName: 'loginWithRecoveryCodeAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput }) => {
        const pending = await getPendingSession();

        if (!pending || !pending.requiresTwoFactor) {
            throw new ActionError('No pending two-factor verification found.');
        }

        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                firstName: users.firstName,
                lastName: users.lastName,
                roles: users.roles,
                isTwoFactorEnabled: users.isTwoFactorEnabled,
                twoFactorSecret: users.twoFactorSecret,
                twoFactorRecoveryCodes: users.twoFactorRecoveryCodes,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, pending.sub))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new ActionError(
                'Two-factor authentication is not configured.'
            );
        }

        const recoveryCodes = user.twoFactorRecoveryCodes ?? [];

        let matchedRecoveryCode: string | undefined;

        for (const code of recoveryCodes) {
            const verified = verifyHash(parsedInput.recoveryCode, code);

            if (verified) {
                matchedRecoveryCode = code;
                break;
            }
        }

        if (!matchedRecoveryCode) {
            throw new ActionError('Invalid recovery code.');
        }

        const updatedRecoveryCodes = recoveryCodes.filter(
            (code) => code !== matchedRecoveryCode
        );

        await db
            .update(users)
            .set({ twoFactorRecoveryCodes: updatedRecoveryCodes })
            .where(eq(users.id, user.id));

        await deletePendingSession();

        await createSession({
            sub: user.id,
            email: user.emailAddress,
            given_name: user.firstName,
            family_name: user.lastName,
            roles: user.roles as Role[],
        });

        redirect('/');
    });
