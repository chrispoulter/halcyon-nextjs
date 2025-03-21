'use server';

import { randomUUID } from 'crypto';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { sendEmail } from '@/lib/email';
import { actionClient } from '@/lib/safe-action';
import { getSiteUrl } from '@/lib/server-utils';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .metadata({ actionName: 'forgotPasswordAction' })
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.emailAddress, parsedInput.emailAddress))
            .limit(1);

        if (user && !user.isLockedOut) {
            const passwordResetToken = randomUUID();
            const baseUrl = await getSiteUrl();

            await db
                .update(users)
                .set({ passwordResetToken })
                .where(eq(users.id, user.id));

            await sendEmail({
                to: user.emailAddress,
                template: 'ResetPassword',
                context: {
                    siteUrl: baseUrl,
                    passwordResetUrl: `${baseUrl}/account/reset-password/${passwordResetToken}`,
                },
            });
        }
    });
