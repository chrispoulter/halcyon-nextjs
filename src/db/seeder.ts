import 'dotenv/config';
import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { generateHash } from '@/lib/hash';
import { config } from '@/lib/config';
import { users } from './schema/users';
import { db } from '.';

async function migrateDb() {
    console.log('Migrating database...');

    try {
        await migrate(db, {
            migrationsFolder: path.join(process.cwd(), 'drizzle'),
        });
    } catch (error) {
        console.error('Failed to migrate database', error);
    }
}

async function seedDb() {
    console.log('Seeding database...');

    try {
        const emailAddress = config.SEED_EMAIL_ADDRESS;
        const password = generateHash(config.SEED_PASSWORD);

        const user: typeof users.$inferInsert = {
            emailAddress,
            password,
            passwordResetToken: null,
            firstName: 'System',
            lastName: 'Administrator',
            dateOfBirth: '1970-01-01',
            roles: ['SYSTEM_ADMINISTRATOR'],
            isLockedOut: false,
        };

        await db.insert(users).values(user).onConflictDoUpdate({
            target: users.normalizedEmailAddress,
            set: user,
        });
    } catch (error) {
        console.error('Failed to seed database', error);
    }
}

async function main() {
    await migrateDb();
    await seedDb();
}

main();
