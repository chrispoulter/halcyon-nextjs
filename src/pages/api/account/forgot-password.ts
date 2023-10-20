import crypto from 'crypto';
import { ProblemResponse } from '@/features/base.types';
import { forgotPasswordSchema } from '@/features/account/account.types';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { sendEmail } from '@/utils/email';
import { getBaseUrl } from '@/utils/url';

const forgotPasswordHandler: Handler<ProblemResponse> = async (req, res) => {
    const body = await forgotPasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
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
                passwordResetToken
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
};

export default mapHandlers({
    put: forgotPasswordHandler
});
