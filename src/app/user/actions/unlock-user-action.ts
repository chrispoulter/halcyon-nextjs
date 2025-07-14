'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import type { UnlockUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isUserAdministrator } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z.uuid('Id must be a valid UUID'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const unlockUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'unlockUserAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput: { id, ...rest } }) => {
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

        await db
            .update(users)
            .set({ isLockedOut: false })
            .where(eq(users.id, user.id));

        const result: UnlockUserResponse = { id: user.id };

        return result;
    });
