import {
    createUserSchema,
    searchUsersSchema,
    UserSort
} from '@/features/user/userTypes';
import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { hashPassword } from '@/utils/hash';
import { isUserAdministrator } from '@/utils/auth';

const router = createApiRouter();

router.use(authorize(isUserAdministrator));

router.get(async (req, res) => {
    const params = await searchUsersSchema.validate(req.query);

    let where = '';
    const args = [];

    if (params.search) {
        where += `WHERE search ILIKE '%' || '$1' || '%'`;
        args.push(params.search);
    }

    const {
        rows: [{ count }]
    } = await query<{ count: number }>(
        `SELECT COUNT(*) FROM users ${where}`,
        args
    );

    let orderBy = ' ORDER BY first_name ASC, last_name ASC';

    switch (params.sort) {
        case UserSort.EMAIL_ADDRESS_ASC:
            orderBy = ' ORDER BY email_address ASC';
            break;

        case UserSort.EMAIL_ADDRESS_DESC:
            orderBy = ' ORDER BY email_address DESC';

        case UserSort.NAME_DESC:
            orderBy = ' ORDER BY first_name DESC, last_name DESC';
            break;
    }

    const skip = (params.page - 1) * params.size;

    const { rows: users } = await query<User[]>(
        `SELECT id, email_address, first_name, last_name, is_locked_out, roles FROM users ${where} ${orderBy} OFFSET $1 LIMIT $2`,
        [skip, params.size, ...args]
    );

    const pageCount = Math.floor((count + params.size - 1) / params.size);
    const hasNextPage = params.page < pageCount;
    const hasPreviousPage = params.page > 1;

    return res.json({
        items: users,
        hasNextPage,
        hasPreviousPage
    });
});

router.post(async (req, res) => {
    const body = await createUserSchema.validate(req.body, {
        stripUnknown: true
    });

    const {
        rows: [existing]
    } = await query<User>(
        'SELECT id FROM users WHERE email_address = $1 LIMIT 1',
        [body.emailAddress]
    );

    if (existing) {
        return res.status(400).json({
            message: 'User name is already taken.'
        });
    }

    const {
        rows: [result]
    } = await query<User>(
        'INSERT INTO users (email_address, password, first_name, last_name, date_of_birth, roles) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [
            body.emailAddress,
            await hashPassword(body.password),
            body.firstName,
            body.lastName,
            body.dateOfBirth,
            body.roles
        ]
    );

    return res.json({
        id: result.id
    });
});

export default router.handler({
    onError
});
