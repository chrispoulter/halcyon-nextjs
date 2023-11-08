import { getUserSchema, unlockUserSchema } from '@/features/user/userTypes';
import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { isUserAdministrator } from '@/utils/auth';

const router = createApiRouter();

router.use(authorize(isUserAdministrator));

router.put(async (req, res) => {
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

    const body = await unlockUserSchema.validate(req.body);

    if (body.version && body.version !== user.xmin) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    await query<User>(
        'UPDATE users SET is_locked_out = $2 WHERE id = $1 LIMIT 1',
        [user.id, false]
    );

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
