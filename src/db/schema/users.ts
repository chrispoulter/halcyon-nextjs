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
        password: text('password'),
        passwordResetToken: uuid('password_reset_token'),
        firstName: text('first_name').notNull(),
        lastName: text('last_name').notNull(),
        dateOfBirth: date('date_of_birth').notNull(),
        isLockedOut: boolean('is_locked_out').notNull().default(false),
        roles: text('roles').array(),
        twoFactorEnabled: boolean('two_factor_enabled')
            .notNull()
            .default(false),
        twoFactorSecret: text('two_factor_secret'), 
        twoFactorTempSecret: text('two_factor_temp_secret'),
        twoFactorRecoveryCodes: text('two_factor_recovery_codes').array(),
        searchVector: tsVector('search_vector').generatedAlwaysAs(
            (): SQL =>
                sql`to_tsvector('english', ${users.firstName} || ' ' || ${users.lastName} || ' ' || ${users.emailAddress})`
        ),
    },
    (table) => [
        primaryKey({ columns: [table.id], name: 'pk_users' }),
        uniqueIndex('ix_users_email_address').on(table.emailAddress),
        index('ix_users_search_vector').using('gin', table.searchVector),
    ]
);
