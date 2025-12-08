import 'server-only';

import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';

export type Profile = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut: boolean;
    isTwoFactorEnabled: boolean;
};

export const getProfile = cache(
    async (userId: string): Promise<Profile | undefined> => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                firstName: users.firstName,
                lastName: users.lastName,
                dateOfBirth: users.dateOfBirth,
                isLockedOut: users.isLockedOut,
                isTwoFactorEnabled: users.isTwoFactorEnabled,
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
            isTwoFactorEnabled: user.isTwoFactorEnabled,
        };
    }
);
