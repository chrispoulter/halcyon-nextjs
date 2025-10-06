import 'server-only';

import { redirect, forbidden } from 'next/navigation';
import z from 'zod';
import { desc, asc, sql, SQL } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isUserAdministrator, type Role } from '@/lib/definitions';
import { getSession } from '@/lib/session';
import { cache } from 'react';

const searchParamsSchema = z.object({
    search: z.string({ message: 'Search must be a valid string' }).catch(''),
    page: z.coerce
        .number({ message: 'Page must be a valid number' })
        .int('Page must be a valid integer')
        .positive('Page must be a postive number')
        .catch(1),
    sort: z
        .enum(
            [
                'EMAIL_ADDRESS_ASC',
                'EMAIL_ADDRESS_DESC',
                'NAME_ASC',
                'NAME_DESC',
            ],
            {
                message: 'Sort must be a valid user sort',
            }
        )
        .catch('NAME_ASC'),
});

const PAGE_SIZE = 5;

export const searchUsers = cache(
    async (params: Record<string, string | string[] | undefined>) => {
        const session = await getSession();

        if (!session) {
            redirect('/account/login');
        }

        if (
            !isUserAdministrator.some((value) => session.roles?.includes(value))
        ) {
            forbidden();
        }

        const { search, page = 1, sort } = searchParamsSchema.parse(params);

        let where: SQL | undefined;

        if (search) {
            where = sql`${users.searchVector} @@ websearch_to_tsquery('english', ${search})`;
        }

        const count = await db.$count(users, where);

        const query = db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                firstName: users.firstName,
                lastName: users.lastName,
                isLockedOut: users.isLockedOut,
                roles: users.roles,
            })
            .from(users)
            .where(where);

        switch (sort) {
            case 'EMAIL_ADDRESS_DESC':
                query.orderBy(desc(users.emailAddress), asc(users.id));
                break;

            case 'EMAIL_ADDRESS_ASC':
                query.orderBy(asc(users.emailAddress), asc(users.id));
                break;

            case 'NAME_DESC':
                query.orderBy(
                    desc(users.firstName),
                    desc(users.lastName),
                    asc(users.id)
                );
                break;

            default:
                query.orderBy(
                    asc(users.firstName),
                    asc(users.lastName),
                    asc(users.id)
                );
                break;
        }

        const skip = (page - 1) * PAGE_SIZE;
        const data = await query.limit(PAGE_SIZE).offset(skip);

        const pageCount = Math.floor((count + PAGE_SIZE - 1) / PAGE_SIZE);
        const hasNextPage = page < pageCount;
        const hasPreviousPage = page > 1;

        return {
            data: {
                items: data.map((user) => ({
                    id: user.id,
                    emailAddress: user.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isLockedOut: user.isLockedOut,
                    roles: (user.roles as Role[]) || undefined,
                })),
                hasNextPage,
                hasPreviousPage,
            },
            request: { search, page, sort },
        };
    }
);
