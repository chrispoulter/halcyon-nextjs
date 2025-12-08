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

const schema = z.object({
    twoFactorCode: z
        .string({ message: 'Authenticator Code must be a valid string' })
        .regex(/^[0-9]{6}$/, 'Authenticator Code must be 6 digits'),
});
export const loginWithTwoFactorAction = actionClient
    .metadata({ actionName: 'loginWithTwoFactorAction' })
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
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, pending.sub))
            .limit(1);

        if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new ActionError('Two-factor authentication is not enabled.');
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            window: 1,
            token: parsedInput.twoFactorCode,
        });

        if (!verified) {
            throw new ActionError('Invalid authenticator code.');
        }

        if (user.isLockedOut) {
            throw new ActionError(
                'This account has been locked out, please try again later.'
            );
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
