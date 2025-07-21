'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import type { DeleteUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isUserAdministrator } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z.uuid('Id must be a valid UUID'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const deleteUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'deleteUserAction' })
    .inputSchema(schema)
    .action<DeleteUserResponse>(
        async ({ parsedInput: { id, ...rest }, ctx: { userId } }) => {
            const [user] = await db
                .select({
                    id: users.id,
                    version: sql<number>`"xmin"`.mapWith(Number),
                })
                .from(users)
                .where(eq(users.id, id))
                .limit(1);

            if (!user) {
                throw new ActionError('User not found.', 404);
            }

            if (rest.version && rest.version !== user.version) {
                throw new ActionError(
                    'Data has been modified since entities were loaded.'
                );
            }

            if (user.id === userId) {
                throw new ActionError(
                    'Cannot delete currently logged in user.'
                );
            }

            await db.delete(users).where(eq(users.id, user.id));

            // BUGFIX: revalidatePath revalidates all paths. Uncomment when fixed.
            // revalidatePath('/user');

            return { id: user.id };
        }
    );
