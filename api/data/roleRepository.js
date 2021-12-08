import { query } from '../utils/database';

export const upsert = async ({ name }) => {
    const result = await query(
        'INSERT INTO roles (name)' +
            ' VALUES ($1)' +
            ' ON CONFLICT ON CONSTRAINT roles_name_key DO NOTHING' +
            ' RETURNING *',
        [name]
    );

    return result[0];
};
