import {
    deleteUserSchema,
    getUserSchema,
    updateUserSchema
} from '@/features/user/userTypes';
import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { isUserAdministrator } from '@/utils/auth';

const router = createApiRouter();

router.use(authorize(isUserAdministrator));

router.get(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const {
        rows: [user]
    } = await query<User>(
        'SELECT id, email_address, first_name, last_name, date_of_birth, is_locked_out, roles, xmin FROM users WHERE id = $1 LIMIT 1',
        [params.id]
    );

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    return res.json({
        id: user.id,
        emailAddress: user.email_address,
        firstName: user.first_name,
        lastName: user.last_name,
        dateOfBirth: user.date_of_birth,
        isLockedOut: user.is_locked_out,
        roles: user.roles,
        version: user.xmin
    });
});

router.put(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const {
        rows: [user]
    } = await query<User>(
        'SELECT id, email_address, xmin FROM users WHERE id = $1 LIMIT 1',
        [params.id]
    );

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await updateUserSchema.validate(req.body, {
        stripUnknown: true
    });

    if (body.version && body.version !== user.xmin) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.email_address !== body.emailAddress) {
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
    }

    await query<User>(
        'UPDATE users SET email_address = $2, first_name = $3, last_name = $4, date_of_birth = $5, roles = $6 WHERE id = $1 LIMIT 1',
        [
            user.id,
            body.emailAddress,
            body.firstName,
            body.lastName,
            body.dateOfBirth,
            body.roles
        ]
    );

    return res.json({
        id: user.id
    });
});

router.delete(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const {
        rows: [user]
    } = await query<User>('SELECT id, xmin FROM users WHERE id = $1 LIMIT 1', [
        params.id
    ]);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await deleteUserSchema.validate(req.body);

    if (body.version && body.version !== user.xmin) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.id === req.currentUserId) {
        return res.status(400).json({
            message: 'Cannot delete currently logged in user.'
        });
    }

    await query<User>('DELETE FROM users WHERE id = $1 LIMIT 1', [user.id]);

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
