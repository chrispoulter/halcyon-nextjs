import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '@/lib/config';

export const db = drizzle(config.DATABASE_URL_UNPOOLED, { logger: true });
