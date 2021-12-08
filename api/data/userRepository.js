import { query } from '../utils/database';

export const userRepository = {
    search: async model => {
        const search = model.search || null;
        const sort = model.sort || 'NAME_ASC';
        const page = Math.max(model.page || 1, 1);
        const size = Math.min(model.size || 50, 50);
        const offset = (page - 1) * size;
        const params = [];

        let countQuery = 'SELECT 1 FROM users u';

        let dataQuery =
            'SELECT' +
            ' u.*,' +
            ' ARRAY(SELECT r.name FROM user_roles ur INNER JOIN roles r ON r.role_id = ur.role_id WHERE ur.user_id = u.user_id) AS roles' +
            ' FROM users u';

        if (search) {
            const filter = ` WHERE (u.email_address || ' ' || u.first_name || ' ' || u.last_name) ILIKE  '%' || $${
                params.length + 1
            } || '%'`;

            countQuery += filter;
            dataQuery += filter;
            params.push(search);
        }

        const count = await query(countQuery, params);

        switch (sort) {
            case 'EMAIL_ADDRESS_ASC':
                dataQuery += ' ORDER BY LOWER(u.email_address) ASC';
                break;
            case 'EMAIL_ADDRESS_DESC':
                dataQuery += ' ORDER BY LOWER(u.email_address) DESC';
                break;
            case 'NAME_DESC':
                dataQuery +=
                    ' ORDER BY LOWER(u.first_name) DESC, LOWER(u.last_name) DESC';
                break;
            default:
                dataQuery +=
                    ' ORDER BY LOWER(u.first_name) ASC, LOWER(u.last_name) ASC';
                break;
        }

        dataQuery += ` OFFSET $${params.length + 1} LIMIT $${
            params.length + 2
        }`;
        params.push(offset, size);

        const result = await query(dataQuery, params);
        const pageCount = (count.length + size - 1) / size;
        const hasNextPage = page < pageCount;
        const hasPreviousPage = page > 1;

        return {
            data: result,
            hasNextPage: hasNextPage,
            hasPreviousPage: hasPreviousPage
        };
    },

    getById: async user_id => {
        const result = await query(
            'SELECT ' +
                ' u.*,' +
                ' ARRAY(SELECT r.name FROM user_roles ur INNER JOIN roles r ON r.role_id = ur.role_id WHERE ur.user_id = u.user_id) AS roles' +
                ' FROM users u' +
                ' WHERE u.user_id = $1' +
                ' LIMIT 1',
            [user_id]
        );

        return result[0];
    },

    getByEmailAddress: async email_address => {
        const result = await query(
            'SELECT ' +
                ' u.*,' +
                ' ARRAY(SELECT r.name FROM user_roles ur INNER JOIN roles r ON r.role_id = ur.role_id WHERE ur.user_id = u.user_id) AS roles' +
                ' FROM users u' +
                ' WHERE u.email_address ILIKE $1' +
                ' LIMIT 1',
            [email_address]
        );

        return result[0];
    },

    create: async ({
        email_address,
        password,
        password_reset_token,
        first_name,
        last_name,
        date_of_birth,
        is_locked_out
    }) => {
        const result = await query(
            'INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7)' +
                ' RETURNING *',
            [
                email_address,
                password,
                password_reset_token,
                first_name,
                last_name,
                date_of_birth,
                is_locked_out
            ]
        );

        return result[0];
    },

    update: async ({
        user_id,
        email_address,
        password,
        password_reset_token,
        first_name,
        last_name,
        date_of_birth,
        is_locked_out
    }) => {
        const result = await query(
            'UPDATE users' +
                ' SET email_address = $1, password = $2, password_reset_token = $3, first_name = $4, last_name = $5, date_of_birth = $6, is_locked_out = $7 ' +
                ' WHERE user_id = $8' +
                ' RETURNING *',
            [
                email_address,
                password,
                password_reset_token,
                first_name,
                last_name,
                date_of_birth,
                is_locked_out,
                user_id
            ]
        );

        return result[0];
    },

    upsert: async ({
        email_address,
        password,
        password_reset_token,
        first_name,
        last_name,
        date_of_birth,
        is_locked_out
    }) => {
        const result = await query(
            'INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7)' +
                ' ON CONFLICT ON CONSTRAINT users_email_address_key' +
                ' DO UPDATE SET email_address = EXCLUDED.email_address, password = EXCLUDED.password, password_reset_token = EXCLUDED.password_reset_token, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, date_of_birth = EXCLUDED.date_of_birth, is_locked_out = EXCLUDED.is_locked_out' +
                ' RETURNING *',
            [
                email_address,
                password,
                password_reset_token,
                first_name,
                last_name,
                date_of_birth,
                is_locked_out
            ]
        );

        return result[0];
    },

    remove: async ({ user_id }) => {
        const result = await query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *',
            [user_id]
        );

        return result[0];
    }
};
