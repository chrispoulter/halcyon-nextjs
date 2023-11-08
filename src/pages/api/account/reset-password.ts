import { resetPasswordSchema } from '@/features/account/accountTypes';
import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError } from '@/utils/router';
import { hashPassword } from '@/utils/hash';

const router = createApiRouter();

router.put(async (req, res) => {
    const body = await resetPasswordSchema.validate(req.body);

    const {
        rows: [user]
    } = await query<User>(
        'SELECT id, password_reset_token FROM users WHERE email_address = $1 LIMIT 1',
        [body.emailAddress]
    );

    if (!user || user.password_reset_token !== body.token) {
        return res.status(400).json({
            message: 'Invalid token.'
        });
    }

    await query<User>(
        'UPDATE users SET password = $2, password_reset_token = $3 WHERE id = $1 LIMIT 1',
        [user.id, await hashPassword(body.newPassword), null]
    );

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
