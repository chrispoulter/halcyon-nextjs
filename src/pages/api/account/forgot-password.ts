import crypto from 'crypto';
import { forgotPasswordSchema } from '@/models/account.types';
import prisma from '@/utils/prisma';
import { handler, Handler } from '@/utils/handler';
import { EmailTemplate, sendEmail } from '@/utils/email';
import { getBaseUrl } from '@/utils/url';

const forgotPasswordHandler: Handler = async (req, res) => {
    const body = await forgotPasswordSchema.parseAsync(req.body);

    const user = await prisma.users.findUnique({
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (user) {
        const token = crypto.randomUUID();

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                passwordResetToken: token
            }
        });

        const baseUrl = getBaseUrl(req);

        await sendEmail({
            to: user.emailAddress,
            template: EmailTemplate.ResetPassword,
            context: {
                siteUrl: baseUrl,
                passwordResetUrl: `${baseUrl}/reset-password/${token}`
            }
        });
    }

    return res.json({
        code: 'FORGOT_PASSWORD',
        message:
            'Instructions as to how to reset your password have been sent to you via email.'
    });
};

export default handler({
    put: forgotPasswordHandler
});
