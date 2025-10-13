import 'server-only';

import { desc, asc, sql, SQL } from 'drizzle-orm';
import { SearchUsersRequest } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { type Role } from '@/lib/definitions';
import { cache } from 'react';

const PAGE_SIZE = 5;

export const searchUsers = cache(
    async ({ search, page = 1, sort }: SearchUsersRequest) => {
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
        };
    }
);
