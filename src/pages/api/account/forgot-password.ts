import { forgotPasswordSchema } from '@/models/account.types';
import prisma from '@/utils/prisma';
import { handler, Handler } from '@/utils/handler';
import { EmailTemplate, sendEmail } from '@/utils/email';

const forgotPasswordHandler: Handler = async (req, res) => {
    const body = await forgotPasswordSchema.validate(req.body);

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

        const protocol = req.headers.referer?.split('://')[0] || 'http';
        const host = req.headers.host;
        const siteUrl = `${protocol}://${host}`;

        await sendEmail({
            to: user.emailAddress,
            template: EmailTemplate.ResetPassword,
            context: {
                siteUrl,
                passwordResetUrl: `${siteUrl}/reset-password/${token}`
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
