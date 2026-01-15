'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { decryptSecret } from '@/lib/encryption';
import { authActionClient, ActionError } from '@/lib/safe-action';
import { verifySecret, generateRecoveryCodes } from '@/lib/two-factor';

type VerifyTwoFactorResponse = {
    id: string;
    recoveryCodes: string[];
};

const schema = z.object({
    verificationCode: z
        .string({ message: 'Verification Code must be a valid string' })
        .regex(/^[0-9]{6}$/, 'Verification Code is not in the correct format'),
});

export const verifyTwoFactorAction = authActionClient()
    .metadata({ actionName: 'verifyTwoFactorAction' })
    .inputSchema(schema)
    .action<VerifyTwoFactorResponse>(
        async ({ parsedInput, ctx: { userId } }) => {
            const [user] = await db
                .select({
                    id: users.id,
                    emailAddress: users.emailAddress,
                    isLockedOut: users.isLockedOut,
                    twoFactorSecret: users.twoFactorSecret,
                })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user || user.isLockedOut) {
                throw new ActionError('User not found.', 404);
            }

            if (!user.twoFactorSecret) {
                throw new ActionError(
                    'Two-factor authentication is not configured.'
                );
            }

            const decryptedSecret = decryptSecret(user.twoFactorSecret);

            const verified = verifySecret(
                decryptedSecret,
                parsedInput.verificationCode
            );

            if (!verified) {
                throw new ActionError('Invalid verification code.');
            }

            const { recoveryCodes, hashedRecoveryCodes } =
                generateRecoveryCodes(10);

            await db
                .update(users)
                .set({
                    isTwoFactorEnabled: true,
                    twoFactorRecoveryCodes: hashedRecoveryCodes,
                })
                .where(eq(users.id, userId));

            revalidatePath('/users');
            revalidatePath(`/users/${user.id}`);
            revalidatePath('/profile');
            revalidatePath('/profile/enable-authenticator');

            return { id: user.id, recoveryCodes };
        }
    );
