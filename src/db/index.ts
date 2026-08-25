import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export const db = drizzle(config.DATABASE_URL, { logger: true });

export async function check(): Promise<{
    service: string;
    status: 'ok' | 'unhealthy';
}> {
    try {
        await db.execute(sql`SELECT 1`);
        return { service: 'database', status: 'ok' };
    } catch (error) {
        logger.error('Database health check failed', error);
        return { service: 'database', status: 'unhealthy' };
    }
}
