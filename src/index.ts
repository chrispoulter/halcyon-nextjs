import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '@/db/schema/users';
import { Role } from '@/lib/definitions';
import { generateHash } from '@/lib/hash';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const emailAddress = process.env.SEED_EMAIL_ADDRESS!;
    const password = generateHash(process.env.SEED_PASSWORD!);

    const user: typeof users.$inferInsert = {
        emailAddress,
        password,
        passwordResetToken: null,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: '1970-01-01',
        roles: [Role.SYSTEM_ADMINISTRATOR],
        isLockedOut: false,
    };

    await db.insert(users).values(user).onConflictDoUpdate({
        target: users.emailAddress,
        set: user,
    });
}

main();
