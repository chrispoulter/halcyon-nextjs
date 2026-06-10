import 'dotenv/config';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { generateHash } from '@/lib/hash';
import { users } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

async function migrateDb() {
    console.log('Migrating database...');

    await migrate(db, {
        migrationsFolder: path.join(process.cwd(), 'drizzle'),
    });

    console.log('Database migrated successfully');
}

async function seedDb() {
    console.log('Seeding database...');

    const emailAddress = process.env.SEED_EMAIL_ADDRESS!;
    const password = generateHash(process.env.SEED_PASSWORD!);

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

    console.log('Database seeded successfully');
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
