'use server';

import { eq, sql } from 'drizzle-orm';
import type { GetProfileResponse } from '@/app/profile/profile-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ActionError, authActionClient } from '@/lib/safe-action';

export const getProfileAction = authActionClient()
    .metadata({ actionName: 'getProfileAction' })
    .action<GetProfileResponse>(async ({ ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                firstName: users.firstName,
                lastName: users.lastName,
                dateOfBirth: users.dateOfBirth,
                isLockedOut: users.isLockedOut,
                version: sql<number>`"xmin"`.mapWith(Number),
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        return {
            id: user.id,
            emailAddress: user.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth,
            version: user.version,
        };
    });
