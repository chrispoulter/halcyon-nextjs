'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateHash } from '@/lib/hash';
import { actionClient, ActionError } from '@/lib/safe-action';

const schema = z.object({
    token: z
        .string({ message: 'Token must be a valid string' })
        .regex(/^[A-F0-9]{32}$/, 'Token is not in the correct format'),
    emailAddress: z.email('Email Address must be a valid email'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
});

type ResetPasswordResponse = {
    id: string;
};

export const resetPasswordAction = actionClient
    .metadata({ actionName: 'resetPasswordAction' })
    .inputSchema(schema)
    .action<ResetPasswordResponse>(async ({ parsedInput }) => {
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

        const password = await generateHash(parsedInput.newPassword);

        await db
            .update(users)
            .set({
                password,
                passwordResetToken: null,
            })
            .where(eq(users.id, user.id));

        return { id: user.id };
    });
