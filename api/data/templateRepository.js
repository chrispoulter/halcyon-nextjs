import { query } from '../utils/database';

export const getByKey = async key => {
    const result = await query(
        'SELECT * FROM templates WHERE key ILIKE $1 LIMIT 1',
        [key]
    );

    return result[0];
};

export const upsert = async ({ key, subject, html }) => {
    const result = await query(
        'INSERT INTO templates (key, subject, html)' +
            ' VALUES ($1, $2, $3)' +
            ' ON CONFLICT ON CONSTRAINT templates_key_key' +
            ' DO UPDATE SET subject = EXCLUDED.subject, html = EXCLUDED.html' +
            ' RETURNING *',
        [key, subject, html]
    );

    return result[0];
};
