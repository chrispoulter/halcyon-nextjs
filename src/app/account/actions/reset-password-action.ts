'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { ResetPasswordResponse } from '@/app/account/account-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateHash } from '@/lib/hash';
import { actionClient, ActionError } from '@/lib/safe-action';

const schema = z.object({
    token: z
        .string({ message: 'Token must be a valid string' })
        .uuid('Token must be a valid UUID'),
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
});

export const resetPasswordAction = actionClient
    .metadata({ actionName: 'resetPasswordAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput }) => {
        const [user] = await db
            .select({
                id: users.id,
                passwordResetToken: users.passwordResetToken,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.emailAddress, parsedInput.emailAddress))
            .limit(1);

        if (
            !user ||
            user.isLockedOut ||
            parsedInput.token !== user.passwordResetToken
        ) {
            throw new ActionError('Invalid token.');
        }

        const password = generateHash(parsedInput.newPassword);

        await db
            .update(users)
            .set({
                password,
                passwordResetToken: null,
            })
            .where(eq(users.id, user.id));

        const result: ResetPasswordResponse = { id: user.id };

        return result;
    });
