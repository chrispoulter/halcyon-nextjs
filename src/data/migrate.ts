import path from 'path';
import { promises as fs } from 'fs';
import { query } from './db';
import { logger } from '@/utils/logger';

const folderPath = path.join(process.cwd(), 'src', 'migrations');

export const migrate = async () => {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
        const sql = await fs.readFile(`${folderPath}/${file}`, 'utf8');
        logger.info('Running migration %s', file);
        await query(sql);
    }
};
