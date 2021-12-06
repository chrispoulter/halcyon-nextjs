import { query } from '../utils/database';

export const templateRepository = {
    getByKey: async key => {
        const result = await query(
            'SELECT template_id, key, subject, html FROM templates WHERE key = $1 LIMIT 1',
            [key]
        );

        return result[0];
    },
    upsert: async ({ key, subject, html }) => {
        const result = await query(
            'INSERT INTO template (key, subject, html) VALUES ($1, $2, $3) RETURNING template_id',
            [key, subject, html]
        );

        return result[0];
    }
};
