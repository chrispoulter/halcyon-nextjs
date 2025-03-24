'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { GetUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { Role } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const getUserAction = authActionClient(roles)
    .metadata({ actionName: 'getUserAction' })
    .schema(schema)
    .action(async ({ parsedInput: { id } }) => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        return {
            id: user.id,
            emailAddress: user.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            roles: user.roles || undefined,
            isLockedOut: user.isLockedOut,
            // version: user.version,
        } as GetUserResponse;
    });
