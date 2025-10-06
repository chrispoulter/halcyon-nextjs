import 'server-only';

import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/session';

export const getProfile = cache(async () => {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

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
        .where(eq(users.id, session.sub))
        .limit(1);

    if (!user || user.isLockedOut) {
        notFound();
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
