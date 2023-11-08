import { Pool, QueryResultRow } from 'pg';
import { logger } from './logger';
import { config } from './config';

export type User = {
    id: number;
    email_address: string;
    password?: string;
    password_reset_token?: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    is_locked_out: boolean;
    roles?: string[];
    search: string;
    xmin: number;
};

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
