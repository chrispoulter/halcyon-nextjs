import { SQL, sql } from 'drizzle-orm';
import {
    pgTable,
    primaryKey,
    uniqueIndex,
    uuid,
    text,
    date,
    boolean,
    customType,
    index,
} from 'drizzle-orm/pg-core';

const tsVector = customType<{ data: string }>({
    dataType() {
        return 'tsvector';
    },
});

export const users = pgTable(
    'users',
    {
        id: uuid('id').notNull().defaultRandom(),
        emailAddress: text('email_address').notNull(),
        normalizedEmailAddress: text(
            'normalized_email_address'
        ).generatedAlwaysAs((): SQL => sql`lower(${users.emailAddress})`),
        password: text('password'),
        passwordResetToken: text('password_reset_token'),
        firstName: text('first_name').notNull(),
        lastName: text('last_name').notNull(),
        dateOfBirth: date('date_of_birth').notNull(),
        isLockedOut: boolean('is_locked_out').notNull().default(false),
        roles: text('roles').array(),
        searchVector: tsVector('search_vector').generatedAlwaysAs(
            (): SQL =>
                sql`to_tsvector('english', ${users.firstName} || ' ' || ${users.lastName} || ' ' || ${users.emailAddress})`
        ),
    },
    (table) => [
        primaryKey({ columns: [table.id], name: 'pk_users' }),
        uniqueIndex('ix_users_normalized_email_address').on(
            table.normalizedEmailAddress
        ),
        index('ix_users_search_vector').using('gin', table.searchVector),
    ]
);
