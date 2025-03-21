'use server';

import { randomUUID } from 'crypto';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { EmailTemplate, sendEmail } from '@/lib/email';
import { actionClient } from '@/lib/safe-action';

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

            await db
                .update(users)
                .set({ passwordResetToken })
                .where(eq(users.id, user.id));

            await sendEmail({
                to: user.emailAddress,
                template: EmailTemplate.ResetPassword,
                context: {
                    passwordResetToken,
                },
            });
        }
    });
