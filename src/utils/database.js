import { Pool } from 'pg';
import { logger } from './logger';
import { config } from './config';

export const pool = new Pool({
    connectionString: config.DATABASE_URL
});

export const query = async (query, params) => {
    logger.debug(
        {
            query: query.replace(/\s\s+/g, ' '),
            params
        },
        'db query executed'
    );

    const { rows } = await pool.query(query, params);
    return rows;
};

export const shutdown = () => {
    logger.debug('db shut down');
    return pool.end();
};
