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
                emailAddress: body.emailAddress
            }
        });

        if (!user || user.passwordResetToken !== body.token) {
            return res.status(400).json({
                code: 'INVALID_TOKEN',
                message: 'Invalid token.'
            });
        }

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                password: await generateHash(body.newPassword),
                passwordResetToken: null
            }
        });

        return res.json({
            code: 'PASSWORD_RESET',
            message: 'Your password has been reset.',
            data: {
                id: user.id
            }
        });
    }
);

export default handler;
