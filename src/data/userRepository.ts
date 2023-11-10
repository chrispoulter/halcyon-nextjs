import { hashPassword } from '@/utils/hash';
import { query } from './db';

type UserRow = {
    id: number;
    email_address: string;
    password?: string;
    password_reset_token?: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    is_locked_out: boolean;
    roles?: string[];
    xmin: string;
};

type UserSearchRow = {
    id: number;
    email_address: string;
    first_name: string;
    last_name: string;
    is_locked_out: boolean;
    roles?: string[];
};

export type CreateUser = {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roles?: string[];
};

export type UpdateUser = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roles?: string[];
};

export const createUser = async (user: CreateUser) => {
    const {
        rows: [result]
    } = await query<{ id: number }>(
        'INSERT INTO users (email_address, password, first_name, last_name, date_of_birth, roles) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [
            user.emailAddress,
            await hashPassword(user.password),
            user.firstName,
            user.lastName,
            `${user.dateOfBirth}T00:00:00.000Z`,
            user.roles
        ]
    );

    return result.id;
};

export const updateUser = async (user: UpdateUser) => {
    await query(
        'UPDATE users SET email_address = $2, first_name = $3, last_name = $4, date_of_birth = $5, roles = $6 WHERE id = $1;',
        [
            user.id,
            user.emailAddress,
            user.firstName,
            user.lastName,
            `${user.dateOfBirth}T00:00:00.000Z`,
            user.roles
        ]
    );
};

export const upsertUser = async (user: CreateUser) => {
    await query(
        `INSERT INTO users (email_address, password, first_name, last_name, date_of_birth, is_locked_out, roles)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (email_address)
DO UPDATE SET 
	email_address = EXCLUDED.email_address, 
	password = EXCLUDED.password, 
	password_reset_token = EXCLUDED.password_reset_token, 
	first_name = EXCLUDED.first_name, 
	last_name = EXCLUDED.last_name, 
	date_of_birth = EXCLUDED.date_of_birth, 
	is_locked_out = EXCLUDED.is_locked_out, 
	roles = EXCLUDED.roles
RETURNING id;`,
        [
            user.emailAddress,
            await hashPassword(user.password),
            user.firstName,
            user.lastName,
            `${user.dateOfBirth}T00:00:00.000Z`,
            false,
            user.roles
        ]
    );
};

export const deleteUser = async (id: number) => {
    await query('DELETE FROM users WHERE id = $1;', [id]);
};

export const getUserById = async (id: number) => {
    const {
        rows: [user]
    } = await query<UserRow>(
        'SELECT id, email_address, password, first_name, last_name, date_of_birth, is_locked_out, roles, xmin FROM users WHERE id = $1 LIMIT 1;',
        [id]
    );

    if (!user) {
        return undefined;
    }

    return {
        id: user.id,
        emailAddress: user.email_address,
        password: user.password,
        passwordResetToken: user.password_reset_token,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        isLockedOut: user.is_locked_out,
        roles: user.roles || undefined,
        version: parseInt(user.xmin)
    };
};

export const getUserByEmailAddress = async (emailAddress: string) => {
    const {
        rows: [user]
    } = await query<UserRow>(
        'SELECT id, email_address, password, first_name, last_name, date_of_birth, is_locked_out, roles, xmin FROM users WHERE email_address = $1 LIMIT 1;',
        [emailAddress]
    );

    if (!user) {
        return undefined;
    }

    return {
        id: user.id,
        emailAddress: user.email_address,
        password: user.password,
        passwordResetToken: user.password_reset_token,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        isLockedOut: user.is_locked_out,
        roles: user.roles || undefined,
        version: parseInt(user.xmin)
    };
};

export const generatePasswordResetToken = async (id: number) => {
    const passwordResetToken = crypto.randomUUID();

    await query('UPDATE users SET password_reset_token = $2 WHERE id = $1;', [
        id,
        passwordResetToken
    ]);

    return passwordResetToken;
};

export const setUserPassword = async (id: number, password: string) => {
    await query(
        'UPDATE users SET password = $2, password_reset_token = $3 WHERE id = $1;',
        [id, await hashPassword(password), null]
    );
};

export const setUserIsLockedOut = async (id: number, isLockedOut: boolean) => {
    await query('UPDATE users SET is_locked_out = $2 WHERE id = $1;', [
        id,
        isLockedOut
    ]);
};

export const searchUsers = async (
    page: number,
    size: number,
    search?: string,
    sort?: string
) => {
    let where = '';
    const args = [];

    if (search) {
        where = `WHERE search ILIKE '%' || $1 || '%'`;
        args.push(search);
    }

    const {
        rows: [{ count }]
    } = await query<{ count: number }>(
        `SELECT COUNT(*) FROM users ${where}`,
        args
    );

    let orderBy = undefined;

    switch (sort) {
        case 'EMAIL_ADDRESS_ASC':
            orderBy = 'ORDER BY email_address ASC';
            break;

        case 'EMAIL_ADDRESS_DESC':
            orderBy = 'ORDER BY email_address DESC';

        case 'NAME_DESC':
            orderBy = 'ORDER BY first_name DESC, last_name DESC';
            break;

        default:
            orderBy = 'ORDER BY first_name ASC, last_name ASC';
            break;
    }

    const skip = (page - 1) * size;

    const { rows } = await query<UserSearchRow>(
        `SELECT id, email_address, first_name, last_name, is_locked_out, roles FROM users ${where} ${orderBy} OFFSET ${skip} LIMIT ${size};`,
        args
    );

    const pageCount = Math.floor((count + size - 1) / size);
    const hasNextPage = page < pageCount;
    const hasPreviousPage = page > 1;

    return {
        items: rows.map(user => ({
            id: user.id,
            emailAddress: user.email_address,
            firstName: user.first_name,
            lastName: user.last_name,
            isLockedOut: user.is_locked_out,
            roles: user.roles || undefined
        })),
        hasNextPage,
        hasPreviousPage
    };
};
