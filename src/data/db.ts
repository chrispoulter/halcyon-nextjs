import { Pool, QueryResultRow } from 'pg';
import { logger } from '@/utils/logger';
import { config } from '@/utils/config';

const pool = new Pool({
    connectionString: config.DATABASE_URL
});

export const query = async <T extends QueryResultRow>(
    text: string,
    params?: any[]
) => {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    logger.info('Executed query (%dms) %s', duration, text);
    return res;
};
