'use server';

import { z } from 'zod';
import { desc, count, sql } from 'drizzle-orm';
import { type SearchUsersResponse, UserSort } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/definitions';

const schema = z.object({
    search: z.string({ message: 'Search must be a valid string' }).optional(),
    page: z.coerce
        .number({ message: 'Page must be a valid number' })
        .min(1, 'Page must be greater than zero')
        .optional(),
    size: z.coerce
        .number({ message: 'Size must be a valid number' })
        .min(1, 'Size must be greater than zero')
        .max(50, 'Size must be less than 50')
        .optional(),
    sort: z
        .nativeEnum(UserSort, { message: 'Sort must be a valid user sort' })
        .optional(),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const searchUsersAction = authActionClient(roles)
    .metadata({ actionName: 'searchUsersAction' })
    .schema(schema)
    .action(async ({ parsedInput: { search, page = 1, size = 10, sort } }) => {
        const query = db.select().from(users);

        const countQuery = db.select({ count: count() }).from(users);

        if (search) {
            query.where(
                sql`${users.searchVector} @@ websearch_to_tsquery('english', ${search})`
            );
            countQuery.where(
                sql`${users.searchVector} @@ websearch_to_tsquery('english', ${search})`
            );
        }

        const [cr] = await countQuery;

        const pageCount = Math.ceil(cr.count / size);

        if (page > pageCount) {
            return { items: [], hasNextPage: false, hasPreviousPage: true };
        }

        if (page > 1) {
            query.offset((page - 1) * size);
        }

        query.limit(size);

        switch (sort) {
            case UserSort.EMAIL_ADDRESS_DESC:
                query.orderBy(desc(users.emailAddress), users.id);
                break;

            case UserSort.EMAIL_ADDRESS_ASC:
                query.orderBy(users.emailAddress, users.id);
                break;

            case UserSort.NAME_DESC:
                query.orderBy(
                    desc(users.firstName),
                    desc(users.lastName),
                    users.id
                );
                break;

            default:
                query.orderBy(users.firstName, users.lastName, users.id);
                break;
        }

        const items = await query;

        return {
            items,
            hasNextPage: page < pageCount,
            hasPreviousPage: page > 1,
        } as SearchUsersResponse;
    });
