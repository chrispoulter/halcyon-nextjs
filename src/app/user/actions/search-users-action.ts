'use server';

import { z } from 'zod';
import { desc, asc, sql, SQL } from 'drizzle-orm';
import { type SearchUsersResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { type Role, isUserAdministrator } from '@/lib/definitions';
import { authActionClient } from '@/lib/safe-action';

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
        .optional(),
});

export const searchUsersAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'searchUsersAction' })
    .inputSchema(schema)
    .action<SearchUsersResponse>(
        async ({ parsedInput: { search, page = 1, size = 10, sort } }) => {
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

            const skip = (page - 1) * size;
            const data = await query.limit(size).offset(skip);

            const pageCount = Math.floor((count + size - 1) / size);
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
