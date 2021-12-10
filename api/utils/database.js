import { Pool } from 'pg';
import { logger } from './logger';
import { config } from './config';

const pool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    ssl: config.DB_SSL
});

export const query = async (query, params) => {
    logger.debug('query executed', {
        query: query.replace(/\s\s+/g, ' '),
        params
    });

    const { rows } = await pool.query(query, params);
    return rows;
};
