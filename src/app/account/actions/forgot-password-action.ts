'use server';

import { randomBytes } from 'crypto';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ResetPasswordEmail } from '@/emails/reset-password-email';
import { sendEmail } from '@/lib/email';
import { generateHash } from '@/lib/hash';
import { actionClient } from '@/lib/safe-action';
import { getSiteUrl } from '@/lib/server-utils';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .metadata({ actionName: 'forgotPasswordAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput }) => {
        const normalizedEmailAddress = parsedInput.emailAddress.toLowerCase();

        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.normalizedEmailAddress, normalizedEmailAddress))
            .limit(1);

        if (!user || user.isLockedOut) {
            return;
        }

        const passwordResetToken = randomBytes(16)
            .toString('hex')
            .toUpperCase();

        const hashedPasswordResetToken = generateHash(passwordResetToken);

        await db
            .update(users)
            .set({ passwordResetToken: hashedPasswordResetToken })
            .where(eq(users.id, user.id));

        const siteUrl = await getSiteUrl();

        await sendEmail({
            to: user.emailAddress,
            subject: 'Reset Password // Halcyon',
            react: ResetPasswordEmail({
                siteUrl,
                passwordResetToken,
            }),
        });
    });
