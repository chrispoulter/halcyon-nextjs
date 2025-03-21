import { pgTable, uuid, text, date, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    emailAddress: text('email_address').notNull().unique(),
    password: text('password'),
    passwordResetToken: text('password_reset_token'),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    isLockedOut: boolean('is_locked_out').notNull().default(false),
    roles: text('roles').array(),
    // searchVector: tsvector("search_vector", {
    //   expression: `to_tsvector('english', first_name || ' ' || last_name || ' ' || email_address)`
    // }).generatedAlways(),
});
