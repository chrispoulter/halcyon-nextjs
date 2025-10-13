import 'server-only';

import { cache } from 'react';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { type Role } from '@/lib/definitions';

export const getUser = cache(async (userId: string) => {
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
        .where(eq(users.id, userId))
        .limit(1);

    if (!user) {
        return undefined;
    }

    return {
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        roles: (user.roles as Role[]) || undefined,
        isLockedOut: user.isLockedOut,
        version: user.version,
    };
});
