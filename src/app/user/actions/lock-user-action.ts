'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { LockUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { Role } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const lockUserAction = authActionClient(roles)
    .metadata({ actionName: 'lockUserAction' })
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { userId } }) => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        // TODO: Validate version
        if (!rest.version && rest.version !== rest.version) {
            throw new ActionError(
                'Data has been modified since entities were loaded.'
            );
        }

        if (user.id === userId) {
            throw new ActionError('Cannot lock currently logged in user.');
        }

        await db
            .update(users)
            .set({ isLockedOut: true })
            .where(eq(users.id, user.id));

        return { id: user.id } as LockUserResponse;
    });
