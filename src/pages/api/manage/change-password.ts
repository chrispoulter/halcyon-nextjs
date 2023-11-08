import { changePasswordSchema } from '@/features/manage/manageTypes';
import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { hashPassword, verifyPassword } from '@/utils/hash';

const router = createApiRouter();

router.use(authorize());

router.put(async (req, res) => {
    const body = await changePasswordSchema.validate(req.body);

    const {
        rows: [user]
    } = await query<User>(
        'SELECT id, password, xmin FROM users WHERE id = $1 LIMIT 1',
        [req.currentUserId]
    );

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    if (body.version && body.version !== parseInt(user.xmin as any)) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (!user.password) {
        return res.status(400).json({
            message: 'Incorrect password.'
        });
    }

    const verified = await verifyPassword(body.currentPassword, user.password);

    if (!verified) {
        return res.status(400).json({
            message: 'Incorrect password.'
        });
    }

    await query<User>(
        'UPDATE users SET password = $2, password_reset_token = $3 WHERE id = $1',
        [user.id, await hashPassword(body.newPassword), null]
    );

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
