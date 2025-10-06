import 'server-only';

import { cache } from 'react';
import { notFound, redirect, forbidden } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isUserAdministrator, type Role } from '@/lib/definitions';
import { getSession } from '@/lib/session';

export const getUser = cache(async (userId: string) => {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!isUserAdministrator.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

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
        notFound();
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
