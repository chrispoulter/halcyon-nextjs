import { Pool } from 'pg';
import { config } from './config';

const pool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE
});

export const query = async (query, params) => {
    console.log('query', query, params);
    const { rows } = await pool.query(query, params);
    return rows;
};
