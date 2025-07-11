import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { config } from '@/lib/config';

console.log('Migrating database...');

try {
    const db = drizzle(config.DATABASE_URL);
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('Database migrated');
    // process.exit(0);
} catch (error) {
    console.error('Failed to migrate database', error);
    process.exit(1);
}
