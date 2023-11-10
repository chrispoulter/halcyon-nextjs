import { Pool, QueryResultRow, types } from 'pg';
import { logger } from '@/utils/logger';
import { config } from '@/utils/config';

types.setTypeParser(types.builtins.DATE, (value) => value)
types.setTypeParser(types.builtins.XID, parseInt);
types.setTypeParser(types.builtins.INT8, parseInt);

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
