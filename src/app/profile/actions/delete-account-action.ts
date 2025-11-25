'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

type DeleteAccountResponse = {
    id: string;
};

export const deleteAccountAction = authActionClient()
    .metadata({ actionName: 'deleteAccountAction' })
    .action<DeleteAccountResponse>(async ({ ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        await db.delete(users).where(eq(users.id, userId));

        await deleteSession();

        // TODO: revalidatePath revalidates all paths. Uncomment when fixed.
        // revalidatePath('/users');

        return { id: user.id };
    });
