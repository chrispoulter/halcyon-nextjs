import { forgotPasswordSchema } from '@/features/account/accountTypes';
import {
    generatePasswordResetToken,
    getUserByEmailAddress
} from '@/data/userRepository';
import { createApiRouter, onError } from '@/utils/router';
import { sendEmail } from '@/utils/email';
import { getBaseUrl } from '@/utils/url';

const router = createApiRouter();

router.put(async (req, res) => {
    const body = await forgotPasswordSchema.validate(req.body);

    const user = await getUserByEmailAddress(body.emailAddress);

    if (user) {
        const passwordResetToken = await generatePasswordResetToken(user.id);

        const siteUrl = getBaseUrl(req);

        await sendEmail({
            template: 'ResetPasswordEmail.html',
            to: user.emailAddress,
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
