import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from '@/lib/config';
import { generateHash } from '@/lib/hash';
import { users } from './schema/users';

const pool = new Pool({ connectionString: config.DATABASE_URL });
const db = drizzle({ client: pool });

async function migrateDatabase() {
    console.log('Migrating database...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
}

async function seedDatabase() {
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

    console.log('Seeding completed successfully');
}

async function main() {
    try {
        await migrateDatabase();
        await seedDatabase();
    } finally {
        await pool.end();
    }
}

main();
