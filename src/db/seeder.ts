import 'dotenv/config';
import { Client } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { generateHash } from '@/lib/hash';
import { config } from '@/lib/config';

async function createDb() {
    console.log('Creating database...');

    const mainClient = new Client(config.DATABASE_URL);

    const { host, port, ssl, user, password, database } = mainClient;

    const postgresClient = new Client({
        host,
        port,
        ssl,
        user,
        password,
        database: 'postgres',
    });

    try {
        await postgresClient.connect();

        const { rows } = await postgresClient.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [database]
        );

        if (rows.length) {
            console.log(`Database "${database}" already exists.`);
            return;
        }

        await postgresClient.query(`CREATE DATABASE "${database}"`);
    } catch (error) {
        console.error('Failed to create database', error);
    } finally {
        await postgresClient.end();
    }
}

async function migrateDb() {
    console.log('Migrating database...');

    try {
        await migrate(db, {
            migrationsFolder: './drizzle',
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
            isTwoFactorEnabled: false,
            twoFactorSecret: null,
            twoFactorRecoveryCodes: null,
            firstName: 'System',
            lastName: 'Administrator',
            dateOfBirth: '1970-01-01',
            isLockedOut: false,
            roles: ['SYSTEM_ADMINISTRATOR'],
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
    await createDb();
    await migrateDb();
    await seedDb();
}

main();
