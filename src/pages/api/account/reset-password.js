import * as Yup from 'yup';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { generateHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.put(
    validationMiddleware({
        body: {
            token: Yup.string().label('Token').required(),
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            newPassword: Yup.string()
                .label('New Password')
                .min(8)
                .max(50)
                .required()
        }
    }),
    async ({ body }, res) => {
        const user = await prisma.users.findUnique({
            where: {
                email_address: body.emailAddress
            }
        });

        if (!user || user.password_reset_token !== body.token) {
            return res.status(400).json({
                code: 'INVALID_TOKEN',
                message: 'Invalid token.'
            });
        }

        await prisma.users.update({
            where: {
                user_id: user.user_id
            },
            data: {
                password: await generateHash(body.newPassword),
                password_reset_token: null
            }
        });

        return res.json({
            code: 'PASSWORD_RESET',
            message: 'Your password has been reset.',
            data: {
                id: user.user_id
            }
        });
    }
);

export default handler;
