'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isUserAdministrator } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z.uuid('Id must be a valid UUID'),
});

type DeleteUserResponse = {
    id: string;
};

export const deleteUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'deleteUserAction' })
    .inputSchema(schema)
    .action<DeleteUserResponse>(
        async ({ parsedInput: { id }, ctx: { userId } }) => {
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

            if (user.id === userId) {
                throw new ActionError(
                    'Cannot delete currently logged in user.'
                );
            }

            await db.delete(users).where(eq(users.id, user.id));

            // TODO: revalidatePath revalidates all paths. Uncomment when fixed.
            // revalidatePath('/users');

            return { id: user.id };
        }
    );
