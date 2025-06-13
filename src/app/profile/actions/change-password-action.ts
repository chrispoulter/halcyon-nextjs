'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import type { ChangePasswordResponse } from '@/app/profile/profile-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { verifyHash } from '@/lib/hash';

const schema = z.object({
    currentPassword: z
        .string({ message: 'Current Password must be a valid string' })
        .min(1, 'Current Password is a required field'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const changePasswordAction = authActionClient()
    .metadata({ actionName: 'changePasswordAction' })
    .schema(schema)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                password: users.password,
                isLockedOut: users.isLockedOut,
                version: sql<number>`"xmin"`.mapWith(Number),
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        if (!parsedInput.version && parsedInput.version !== user.version) {
            throw new ActionError(
                'Data has been modified since entities were loaded.'
            );
        }

        if (!user.password) {
            throw new ActionError('Incorrect password.');
        }

        const verified = verifyHash(parsedInput.currentPassword, user.password);

        if (!verified) {
            throw new ActionError('Incorrect password.');
        }

        await db
            .update(users)
            .set({
                password: parsedInput.newPassword,
                passwordResetToken: null,
            })
            .where(eq(users.id, userId));

        const result: ChangePasswordResponse = { id: user.id };

        return result;
    });
