'use server';

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
        .regex(/^[0-9]{8}$/, 'Recovery Code must be exactly 8 digits'),
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

        if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new ActionError(
                'Two-factor authentication is not configured.'
            );
        }

        const codes = user.twoFactorRecoveryCodes ?? [];

        const matchedRecoveryCode = codes.find((code) =>
            verifyHash(parsedInput.recoveryCode, code)
        );

        if (!matchedRecoveryCode) {
            throw new ActionError('Invalid recovery code.');
        }

        if (user.isLockedOut) {
            throw new ActionError(
                'This account has been locked out, please try again later.'
            );
        }

        const updatedRecoveryCodes = codes.filter(
            (code) => !verifyHash(parsedInput.recoveryCode, code)
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
    });
