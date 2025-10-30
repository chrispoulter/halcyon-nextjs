import 'server-only';

import { cache } from 'react';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';

export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut: boolean;
    version: number;
};

export const getProfile = cache(async (userId: string) => {
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
        return undefined;
    }

    return {
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        isLockedOut: user.isLockedOut,
        version: user.version,
    };
});
