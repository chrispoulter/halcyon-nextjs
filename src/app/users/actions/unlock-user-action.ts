'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isUserAdministrator } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z.uuid('Id must be a valid UUID'),
});

type UnlockUserResponse = {
    id: string;
};

export const unlockUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'unlockUserAction' })
    .inputSchema(schema)
    .action<UnlockUserResponse>(async ({ parsedInput: { id } }) => {
        const [user] = await db
            .select({
                id: users.id,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        await db
            .update(users)
            .set({ isLockedOut: false })
            .where(eq(users.id, user.id));

        revalidatePath('/users');
        revalidatePath(`/users/${user.id}`);
        revalidatePath('/profile');

        return { id: user.id };
    });
