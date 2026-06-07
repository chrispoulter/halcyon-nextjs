import 'dotenv/config';
import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { generateHash } from '@/lib/hash';
import { config } from '@/lib/config';
import { users } from './schema';
import { db } from '.';

async function migrateDb() {
    console.log('Migrating database...');

    await migrate(db, {
        migrationsFolder: path.join(process.cwd(), 'drizzle'),
    });
}

async function seedDb() {
    console.log('Seeding database...');

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
}

async function main() {
    await migrateDb();
    await seedDb();
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => db.$client.end());
