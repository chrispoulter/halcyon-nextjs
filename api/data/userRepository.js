import { query } from '../utils/database';

export const userRepository = {
    search: async ({ search, sort, page, size }) => {
        let statement =
            'SELECT user_id, email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out FROM users';

        const offset = (page - 1) * [size];
        const params = [offset, size, search];

        if (search) {
            statement += ` WHERE LOWER(first_name || ' ' || last_name || ' ' || email_address) LIKE '%' || $1 || '%'`;
        }

        if (sort) {
            switch (sort) {
                case 'EMAIL_ADDRESS_ASC':
                    statement += ' ORDER BY email_address ASC';
                    break;
                case 'EMAIL_ADDRESS_DESC':
                    statement += ' ORDER BY email_address DESC';
                    break;
                case 'NAME_DESC':
                    statement += ' ORDER BY first_name DESC, last_name DESC';
                    break;
                default:
                    statement += ' ORDER BY first_name ASC, last_name ASC';
                    break;
            }
        }

        if (page) {
            statement += ' OFFSET $2 ';
        }

        if (size) {
            statement += ' LIMIT $3';
        }

        return await query(statement, [params]);
    },

    getById: async id => {
        const result = await query(
            'SELECT user_id, email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out FROM users WHERE id = $1 LIMIT 1',
            [id]
        );

        return result[0];
    },

    getByEmailAddress: async emailAddress => {
        const result = await query(
            'SELECT user_id, email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out FROM users WHERE email_address = $1 LIMIT 1',
            [emailAddress]
        );

        return result[0];
    },

    create: async ({
        emailAddress,
        password,
        passwordResetToken,
        firstName,
        lastName,
        dateOfBirth,
        is_locked_out
    }) => {
        const result = await query(
            'INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
            [
                emailAddress,
                password,
                passwordResetToken,
                firstName,
                lastName,
                dateOfBirth,
                is_locked_out
            ]
        );

        return result[0];
    },

    update: async ({
        id,
        emailAddress,
        password,
        passwordResetToken,
        firstName,
        lastName,
        dateOfBirth,
        is_locked_out
    }) => {
        const result = await query(
            'UPDATE users SET email_address = $1, password = $2, password_reset_token = $3, first_name = $4, last_name = $5, date_of_birth = $6, is_locked_out = $7) WHERE id = $8',
            [
                emailAddress,
                password,
                passwordResetToken,
                firstName,
                lastName,
                dateOfBirth,
                is_locked_out,
                id
            ]
        );

        return result[0];
    },

    upsert: async ({
        emailAddress,
        password,
        passwordResetToken,
        firstName,
        lastName,
        dateOfBirth,
        is_locked_out
    }) => {
        const result = await query(
            'INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
            [
                emailAddress,
                password,
                passwordResetToken,
                firstName,
                lastName,
                dateOfBirth,
                is_locked_out
            ]
        );

        return result[0];
    },

    remove: async ({ id }) => {
        const result = await query('DELETE FROM users WHERE user_id = $1', [
            id
        ]);

        return result[0];
    }
};
