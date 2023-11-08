import { forgotPasswordSchema } from '@/features/account/accountTypes';
import { query } from '@/data/db';
import { User } from '@/data/schema';
import { createApiRouter, onError } from '@/utils/router';
import { sendEmail } from '@/utils/email';
import { getBaseUrl } from '@/utils/url';

const router = createApiRouter();

router.put(async (req, res) => {
    const body = await forgotPasswordSchema.validate(req.body);

    const {
        rows: [user]
    } = await query<User>(
        'SELECT id, email_address FROM users WHERE email_address = $1 LIMIT 1',
        [body.emailAddress]
    );

    if (user) {
        const passwordResetToken = crypto.randomUUID();

        await query(
            'UPDATE users SET password_reset_token = $2 WHERE id = $1',
            [user.id, passwordResetToken]
        );

        const siteUrl = getBaseUrl(req);

        await sendEmail({
            template: 'ResetPasswordEmail.html',
            to: user.email_address,
            data: {
                passwordResetToken,
                siteUrl
            }
        });
    }

    return res.status(200).end();
});

export default router.handler({
    onError
});
