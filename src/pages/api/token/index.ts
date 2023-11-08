import { createTokenSchema } from '@/features/token/tokenTypes';
import { createApiRouter, onError } from '@/utils/router';
import { User, query } from '@/utils/db';
import { verifyPassword } from '@/utils/hash';
import { generateJwtToken } from '@/utils/jwt';

const router = createApiRouter();

router.post(async (req, res) => {
    const body = await createTokenSchema.validate(req.body);

    const {
        rows: [user]
    } = await query<User>(
        'SELECT id, email_address, password, first_name, last_name, is_locked_out, roles FROM users WHERE email_address = $1 LIMIT 1',
        [body.emailAddress]
    );

    if (!user || !user.password) {
        return res.status(400).json({
            message: 'The credentials provided were invalid.'
        });
    }

    const verified = await verifyPassword(body.password, user.password);

    if (!verified) {
        return res.status(400).json({
            message: 'The credentials provided were invalid.'
        });
    }

    if (user.is_locked_out) {
        return res.status(400).json({
            message: 'This account has been locked out, please try again later.'
        });
    }

    const token = await generateJwtToken(user);

    return res.send(token);
});

export default router.handler({
    onError
});
