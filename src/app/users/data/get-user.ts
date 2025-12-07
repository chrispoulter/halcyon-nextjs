import 'server-only';

import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { type Role } from '@/lib/definitions';

export type GetUserResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut: boolean;
    twoFactorEnabled: boolean;
    roles?: Role[];
};

export const getUser = cache(async (userId: string) => {
    const [user] = await db
        .select({
            id: users.id,
            emailAddress: users.emailAddress,
            firstName: users.firstName,
            lastName: users.lastName,
            dateOfBirth: users.dateOfBirth,
            isLockedOut: users.isLockedOut,
            twoFactorEnabled: users.twoFactorEnabled,
            roles: users.roles,
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
        isLockedOut: user.isLockedOut,
        twoFactorEnabled: user.twoFactorEnabled,
        roles: (user.roles as Role[]) || undefined,
    };
});
