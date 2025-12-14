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
import { verifySecret } from '@/lib/two-factor';

const schema = z.object({
    authenticatorCode: z
        .string({ message: 'Authenticator Code must be a valid string' })
        .regex(/^[0-9]{6}$/, 'Authenticator Code is not in the correct format'),
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

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new ActionError(
                'Two-factor authentication is not configured.'
            );
        }

        const verified = verifySecret(
            user.twoFactorSecret,
            parsedInput.authenticatorCode
        );

        if (!verified) {
            throw new ActionError('Invalid authenticator code.');
        }

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
