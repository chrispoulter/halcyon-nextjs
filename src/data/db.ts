import { Pool, PoolConfig, QueryResultRow, types } from 'pg';
import { parse } from 'pg-connection-string';
import { createdb } from 'pgtools';
import path from 'path';
import { promises as fs } from 'fs';
import { logger } from '@/utils/logger';
import { config } from '@/utils/config';

types.setTypeParser(types.builtins.DATE, value => value);
types.setTypeParser(types.builtins.XID, parseInt);
types.setTypeParser(types.builtins.INT8, parseInt);

const poolConfig = parse(config.DATABASE_URL) as PoolConfig;
const pool = new Pool(poolConfig);

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

export const migrate = async () => {
    try {
        await createdb(poolConfig, poolConfig.database!);
    } catch (error) {
        if (error instanceof Error && error.name === 'duplicate_database') {
            return;
        }

        throw error;
    }

    const folderPath = path.join(process.cwd(), 'src', 'migrations');
    const files = await fs.readdir(folderPath);

    for (const file of files) {
        const sql = await fs.readFile(`${folderPath}/${file}`, 'utf8');
        logger.info('Running migration %s', file);
        await query(sql);
    }
};
