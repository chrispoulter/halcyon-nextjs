import { query } from '../utils/database';

export const userRepository = {
    search: async ({ search, sort, page, size }) => {
        let statement = 'SELECT * FROM users';

        if (search) {
            statement += ` WHERE (first_name || ' ' || last_name || ' ' || email_address) ILIKE  '%' || $1 || '%'`;
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

        const offset = (page - 1) * [size];
        statement += ' OFFSET $2 LIMIT $3';

        return await query(statement, [search, offset, size]);
    },

    getById: async id => {
        const result = await query(
            'SELECT * FROM users WHERE user_id = $1 LIMIT 1',
            [id]
        );

        return result[0];
    },

    getByEmailAddress: async emailAddress => {
        const result = await query(
            'SELECT * FROM users WHERE email_address ILIKE $1 LIMIT 1',
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
        isLockedOut
    }) => {
        const result = await query(
            'INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7)' +
                ' RETURNING *',
            [
                emailAddress,
                password,
                passwordResetToken,
                firstName,
                lastName,
                dateOfBirth,
                isLockedOut
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
        isLockedOut
    }) => {
        const result = await query(
            'UPDATE users' +
                ' SET email_address = $1, password = $2, password_reset_token = $3, first_name = $4, last_name = $5, date_of_birth = $6, is_locked_out = $7 ' +
                ' WHERE user_id = $8' +
                ' RETURNING *',
            [
                emailAddress,
                password,
                passwordResetToken,
                firstName,
                lastName,
                dateOfBirth,
                isLockedOut,
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
        isLockedOut
    }) => {
        const result = await query(
            'INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7)' +
                ' ON CONFLICT ON CONSTRAINT users_email_address_key' +
                ' DO UPDATE SET email_address = EXCLUDED.email_address, password = EXCLUDED.password, password_reset_token = EXCLUDED.password_reset_token, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, date_of_birth = EXCLUDED.date_of_birth, is_locked_out = EXCLUDED.is_locked_out' +
                ' RETURNING *',
            [
                emailAddress,
                password,
                passwordResetToken,
                firstName,
                lastName,
                dateOfBirth,
                isLockedOut
            ]
        );

        return result[0];
    },

    remove: async ({ id }) => {
        const result = await query('DELETE FROM users WHERE user_id = $1 RETURNING *', [
            id
        ]);

        return result[0];
    }
};
