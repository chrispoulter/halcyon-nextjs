'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

const schema = z.object({
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const deleteAccountAction = authActionClient()
    .metadata({ actionName: 'deleteAccountAction' })
    .schema(schema)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        // TODO: Validate version
        if (
            !parsedInput.version &&
            parsedInput.version !== parsedInput.version
        ) {
            throw new ActionError(
                'Data has been modified since entities were loaded.'
            );
        }

        await db.delete(users).where(eq(users.id, userId));

        await deleteSession();

        return { id: user.id } as DeleteAccountResponse;
    });
