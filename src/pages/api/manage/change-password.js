import * as Yup from 'yup';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { verifyHash, generateHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.use(authMiddleware());

handler.put(
    validationMiddleware({
        body: {
            currentPassword: Yup.string().label('Current Password').required(),
            newPassword: Yup.string()
                .label('New Password')
                .min(8)
                .max(50)
                .required()
        }
    }),
    async ({ payload, body }, res) => {
        const user = await prisma.users.findUnique({
            where: {
                id: payload.sub
            }
        });

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        const verified = await verifyHash(body.currentPassword, user.password);

        if (!verified) {
            return res.status(400).json({
                code: 'INCORRECT_PASSWORD',
                message: 'Incorrect password.'
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
            code: 'PASSWORD_CHANGED',
            message: 'Your password has been changed.',
            data: {
                id: user.id
            }
        });
    }
);

export default handler;
