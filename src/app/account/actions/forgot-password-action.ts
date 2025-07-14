'use server';

import { randomUUID } from 'crypto';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ResetPasswordEmail } from '@/emails/reset-password-email';
import { sendEmail } from '@/lib/email';
import { actionClient } from '@/lib/safe-action';
import { getSiteUrl } from '@/lib/server-utils';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .metadata({ actionName: 'forgotPasswordAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput }) => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.emailAddress, parsedInput.emailAddress))
            .limit(1);

        if (user && !user.isLockedOut) {
            const passwordResetToken = randomUUID();

            await db
                .update(users)
                .set({ passwordResetToken })
                .where(eq(users.id, user.id));

            const siteUrl = await getSiteUrl();

            await sendEmail({
                to: user.emailAddress,
                subject: 'Reset Password // Halcyon',
                react: ResetPasswordEmail({
                    siteUrl,
                    resetPasswordUrl: `${siteUrl}/account/reset-password/${passwordResetToken}`,
                }),
            });
        }
    });
