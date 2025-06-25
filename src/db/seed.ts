import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '@/db/schema/users';
import { generateHash } from '@/lib/hash';
import { config } from '@/lib/config';

const db = drizzle(config.DATABASE_URL);

async function main() {
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
            target: users.emailAddress,
            set: user,
        });

        console.log(`Seeded user "${emailAddress}"`);
    } catch (error) {
        console.error('Failed to seed database', error);
        process.exit(1);
    }
}

main();
