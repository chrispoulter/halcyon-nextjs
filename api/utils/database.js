import { Pool } from 'pg';
import { config } from './config';

const pgPool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: 'postgres',
    ssl: config.DB_SSL
});

const pool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    ssl: config.DB_SSL
});

export const query = async (query, params) => {
    console.log('query', query, params);
    const { rows } = await pool.query(query, params);
    return rows;
};

export const createDatabase = async () => {
    console.log('createDatabase');

    const { rows } = await pgPool.query(
        `SELECT true AS exists FROM pg_database WHERE datname = '${config.DB_DATABASE}'`
    );

    if (!rows[0]) {
        await pgPool.query(`CREATE DATABASE ${config.DB_DATABASE}`);
    }
};
