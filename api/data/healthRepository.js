import { query } from '../utils/database';

export const healthRepository = {
    getStatus: async () => {
        const result = await query('SELECT NOW()');

        return result[0];
    }
};
