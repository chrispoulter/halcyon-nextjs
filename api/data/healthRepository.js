import { query } from '../utils/database';

export const getStatus = async () => {
    const result = await query('SELECT true AS connected');

    return result[0];
};
