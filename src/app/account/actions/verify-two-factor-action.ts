'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import speakeasy from 'speakeasy';
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

const schema = z
    .object({
        code: z.string().max(10),
        recoveryCode: z.string().max(100),
    })
    .refine((data) => !!data.code || !!data.recoveryCode, {
        message: 'Provide either a 2FA code or a recovery code',
        path: ['code'],
    });

export const verifyTwoFactorAction = actionClient
    .metadata({ actionName: 'verifyTwoFactorAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput }) => {
        const pending = await getPendingSession();

        if (!pending || !pending.requires2fa) {
            throw new ActionError('No pending two factor verification found.');
        }

        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                firstName: users.firstName,
                lastName: users.lastName,
                roles: users.roles,
                twoFactorEnabled: users.twoFactorEnabled,
                twoFactorSecret: users.twoFactorSecret,
                twoFactorRecoveryCodes: users.twoFactorRecoveryCodes,
            })
            .from(users)
            .where(eq(users.id, pending.sub))
            .limit(1);

        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            throw new ActionError(
                'Two factor authentication is not configured.'
            );
        }

        if (parsedInput.recoveryCode) {
            const codes = user.twoFactorRecoveryCodes ?? [];

            const matchIndex = codes.findIndex((c) =>
                verifyHash(parsedInput.recoveryCode!, c)
            );

            if (matchIndex === -1) {
                throw new ActionError('Invalid recovery code.');
            }

            // Consume the recovery code
            const updated = [...codes];
            updated.splice(matchIndex, 1);

            await db
                .update(users)
                .set({ twoFactorRecoveryCodes: updated })
                .where(eq(users.id, user.id));
        } else {
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                window: 1,
                token: parsedInput.code!,
            });

            if (!verified) {
                throw new ActionError('Invalid two factor code.');
            }
        }

        await deletePendingSession();

        await createSession({
            sub: user.id,
            email: user.emailAddress,
            given_name: user.firstName,
            family_name: user.lastName,
            roles: user.roles as Role[],
        });
    });
