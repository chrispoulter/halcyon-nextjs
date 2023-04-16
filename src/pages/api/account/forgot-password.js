import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { sendEmail } from '@/utils/email';
import { getHandler } from '@/utils/handler';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.put(
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required()
        }
    }),
    async (req, res) => {
        const user = await prisma.users.findUnique({
            where: {
                emailAddress: req.body.emailAddress
            }
        });

        if (user) {
            const token = uuidv4();

            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    passwordResetToken: token
                }
            });

            const protocol = req.headers.referer?.split('://')[0];
            const host = req.headers.host;
            const siteUrl = `${protocol}://${host}`;

            await sendEmail({
                to: user.emailAddress,
                template: 'RESET_PASSWORD',
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
    }
);

export default handler;
