import * as Yup from 'yup';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { generateToken } from '@/utils/jwt';
import { verifyHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.post(
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .email()
                .required(),
            password: Yup.string().label('Password').required()
        }
    }),
    async ({ body }, res) => {
        const user = await prisma.users.findUnique({
            where: {
                emailAddress: body.emailAddress
            }
        });

        if (!user || !user.password) {
            return res.status(400).json({
                code: 'CREDENTIALS_INVALID',
                message: 'The credentials provided were invalid.'
            });
        }

        const verified = await verifyHash(body.password, user.password);

        if (!verified) {
            return res.status(400).json({
                code: 'CREDENTIALS_INVALID',
                message: 'The credentials provided were invalid.'
            });
        }

        if (user.isLockedOut) {
            return res.status(400).json({
                code: 'USER_LOCKED_OUT',
                message:
                    'This account has been locked out, please try again later.'
            });
        }

        return res.json({
            data: generateToken(user)
        });
    }
);

export default handler;
