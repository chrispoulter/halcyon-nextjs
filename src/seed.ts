import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '@/db/schema/users';
import { Role } from '@/lib/definitions';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const user: typeof users.$inferInsert = {
        emailAddress: process.env.SEED_EMAIL_ADDRESS!,
        password: process.env.SEED_PASSWORD!,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: '1970-01-01',
        roles: [Role.SYSTEM_ADMINISTRATOR],
    };

    await db.insert(users).values(user).onConflictDoUpdate({
        target: users.emailAddress,
        set: user,
    });
}

main();
