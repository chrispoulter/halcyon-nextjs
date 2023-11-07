import { forgotPasswordSchema } from '@/features/account/accountTypes';
import { createApiRouter, onError } from '@/utils/router';
import prisma from '@/utils/prisma';
import { sendEmail } from '@/utils/email';
import { getBaseUrl } from '@/utils/url';

const router = createApiRouter();

router.put(async (req, res) => {
    const body = await forgotPasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            emailAddress: true
        },
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (user) {
        const passwordResetToken = crypto.randomUUID();

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken,
                version: crypto.randomUUID()
            }
        });

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
