'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import type { GetUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { type Role, isUserAdministrator } from '@/lib/definitions';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
});

export const getUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'getUserAction' })
    .inputSchema(schema)
    .action(async ({ parsedInput: { id } }) => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                firstName: users.firstName,
                lastName: users.lastName,
                dateOfBirth: users.dateOfBirth,
                roles: users.roles,
                isLockedOut: users.isLockedOut,
                version: sql<number>`"xmin"`.mapWith(Number),
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        const result: GetUserResponse = {
            id: user.id,
            emailAddress: user.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            roles: (user.roles as Role[]) || undefined,
            isLockedOut: user.isLockedOut,
            version: user.version,
        };

        return result;
    });
