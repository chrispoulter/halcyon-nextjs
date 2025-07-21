'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
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
    .inputSchema(schema)
    .action<DeleteAccountResponse>(async ({ parsedInput, ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
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

        await db.delete(users).where(eq(users.id, userId));

        await deleteSession();

        // BUGFIX: revalidatePath revalidates all paths. Uncomment when fixed.
        // revalidatePath('/user');

        return { id: user.id };
    });
