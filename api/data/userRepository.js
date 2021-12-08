import { query } from '../utils/database';

const userRoles = `ARRAY(SELECT r.name FROM user_roles ur INNER JOIN roles r ON r.role_id = ur.role_id WHERE ur.user_id = u.user_id) AS roles`;

export const search = async model => {
    const search = model.search;
    const sort = model.sort || 'NAME_ASC';
    const page = Math.max(model.page || 1, 1);
    const size = Math.min(model.size || 50, 50);

    const params = [];

    let searchQuery = '';

    if (search) {
        searchQuery = `WHERE (u.email_address || ' ' || u.first_name || ' ' || u.last_name) ILIKE  '%' || $${
            params.length + 1
        } || '%'`;
        params.push(search);
    }

    const count = await query(
        `SELECT 
            1 
        FROM 
            users u
        ${searchQuery}`,
        params
    );

    let sortQuery = '';

    switch (sort) {
        case 'EMAIL_ADDRESS_ASC':
            sortQuery = `ORDER BY LOWER(u.email_address) ASC`;
            break;
        case 'EMAIL_ADDRESS_DESC':
            sortQuery = `ORDER BY LOWER(u.email_address) DESC`;
            break;
        case 'NAME_DESC':
            sortQuery = `ORDER BY LOWER(u.first_name) DESC, LOWER(u.last_name) DESC`;
            break;
        default:
            sortQuery = `ORDER BY LOWER(u.first_name) ASC, LOWER(u.last_name) ASC`;
            break;
    }

    const offsetQuery = `OFFSET $${params.length + 1} LIMIT $${
        params.length + 2
    }`;

    const offset = (page - 1) * size;
    params.push(offset, size);

    const result = await query(
        `SELECT
            u.*,
            ${userRoles}
        FROM
            users u
        ${searchQuery} 
        ${sortQuery} 
        ${offsetQuery}`,
        params
    );

    const pageCount = Math.floor((count.length + size - 1) / size);
    const hasNextPage = page < pageCount;
    const hasPreviousPage = page > 1;

    return {
        data: result,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage
    };
};

export const getById = async user_id => {
    const result = await query(
        `SELECT
            u.*,
            ${userRoles}
        FROM
            users u
        WHERE
            u.user_id = $1
        LIMIT 1`,
        [user_id]
    );

    return result[0];
};

export const getByEmailAddress = async email_address => {
    const result = await query(
        `SELECT
            u.*,
            ${userRoles}
        FROM
            users u
        WHERE
            u.email_address ILIKE $1
        LIMIT 1`,
        [email_address]
    );

    return result[0];
};

export const create = async ({
    email_address,
    password,
    password_reset_token,
    first_name,
    last_name,
    date_of_birth,
    is_locked_out = false,
    roles = []
}) => {
    const result = await query(
        `INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
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

    await updateRoles({
        user_id: result[0].user_id,
        roles
    });

    return result[0];
};

export const update = async ({
    user_id,
    email_address,
    password,
    password_reset_token,
    first_name,
    last_name,
    date_of_birth,
    is_locked_out = false,
    roles = []
}) => {
    const result = await query(
        `UPDATE users
        SET email_address = $2,
            password = $3,
            password_reset_token = $4,
            first_name = $5,
            last_name = $6,
            date_of_birth = $7,
            is_locked_out = $8
        WHERE
            user_id = $1
        RETURNING *`,
        [
            user_id,
            email_address,
            password,
            password_reset_token,
            first_name,
            last_name,
            date_of_birth,
            is_locked_out
        ]
    );

    await updateRoles({
        user_id,
        roles
    });

    return result[0];
};

export const upsert = async ({
    email_address,
    password,
    password_reset_token,
    first_name,
    last_name,
    date_of_birth,
    is_locked_out = false,
    roles = []
}) => {
    const result = await query(
        `INSERT INTO users (email_address, password, password_reset_token, first_name, last_name, date_of_birth, is_locked_out)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT ON CONSTRAINT users_email_address_key
        DO UPDATE SET 
            email_address = EXCLUDED.email_address,
            password = EXCLUDED.password,
            password_reset_token = EXCLUDED.password_reset_token,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            date_of_birth = EXCLUDED.date_of_birth,
            is_locked_out = EXCLUDED.is_locked_out
        RETURNING *`,
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

    await updateRoles({
        user_id: result[0].user_id,
        roles
    });

    return result[0];
};

export const updateRoles = async ({ user_id, roles }) => {
    await Promise.all([
        query(
            `DELETE FROM user_roles ur
            USING roles r
            WHERE
                ur.role_id = r.role_id
            AND ur.user_id = $1
            AND NOT r.name = ANY ($2)`,
            [user_id, roles]
        ),
        query(
            `INSERT INTO user_roles (user_id, role_id)
            SELECT
                $1,
                r.role_id 
            FROM
                roles r
            WHERE
                r.name = ANY ($2)
            ON CONFLICT ON CONSTRAINT user_roles_pkey DO NOTHING`,
            [user_id, roles]
        )
    ]);
};

export const remove = async ({ user_id }) => {
    const result = await query(
        `DELETE FROM users
        WHERE user_id = $1
        RETURNING *`,
        [user_id]
    );

    return result[0];
};
