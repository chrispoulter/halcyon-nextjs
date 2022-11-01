import * as Yup from 'yup';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { getHandler } from '@/utils/handler';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.use(authMiddleware());

handler.get(async ({ payload }, res) => {
    const user = await prisma.users.findUnique({
        where: {
            user_id: payload.sub
        }
    });

    if (!user || user.is_locked_out) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    return res.json({
        data: {
            id: user.user_id,
            emailAddress: user.email_address,
            firstName: user.first_name,
            lastName: user.last_name,
            dateOfBirth: user.date_of_birth.toISOString()
        }
    });
});

handler.put(
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            firstName: Yup.string().label('First Name').max(50).required(),
            lastName: Yup.string().label('Last Name').max(50).required(),
            dateOfBirth: Yup.string().label('Date Of Birth').required()
        }
    }),
    async ({ payload, body }, res) => {
        const user = await prisma.users.findUnique({
            where: {
                user_id: payload.sub
            }
        });

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.email_address !== body.emailAddress) {
            const existing = await prisma.users.findUnique({
                where: {
                    email_address: body.emailAddress
                }
            });

            if (existing) {
                return res.status(400).json({
                    code: 'DUPLICATE_USER',
                    message: `User name "${body.emailAddress}" is already taken.`
                });
            }
        }

        await prisma.users.update({
            where: {
                user_id: user.user_id
            },
            data: {
                email_address: body.emailAddress,
                first_name: body.firstName,
                last_name: body.lastName,
                date_of_birth: body.dateOfBirth
            }
        });

        return res.json({
            code: 'PROFILE_UPDATED',
            message: 'Your profile has been updated.',
            data: {
                id: user.user_id
            }
        });
    }
);

handler.delete(async ({ payload }, res) => {
    const user = await prisma.users.findUnique({
        where: {
            user_id: payload.sub
        }
    });

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    await prisma.users.delete({
        where: {
            user_id: user.user_id
        }
    });

    return res.json({
        code: 'ACCOUNT_DELETED',
        message: 'Your account has been deleted.',
        data: {
            id: user.user_id
        }
    });
});

export default handler;
