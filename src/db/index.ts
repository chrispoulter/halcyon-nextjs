import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '@/lib/config';

export const db = drizzle(config.DATABASE_URL, { logger: true });
