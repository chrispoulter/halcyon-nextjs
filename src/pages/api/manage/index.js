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
            id: payload.sub
        }
    });

    if (!user || user.isLockedOut) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    return res.json({
        data: {
            id: user.id,
            emailAddress: user.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth.toISOString()
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
                id: payload.sub
            }
        });

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.emailAddress !== body.emailAddress) {
            const existing = await prisma.users.findUnique({
                where: {
                    emailAddress: body.emailAddress
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
                id: user.id
            },
            data: {
                emailAddress: body.emailAddress,
                firstName: body.firstName,
                lastName: body.lastName,
                dateOfBirth: body.dateOfBirth
            }
        });

        return res.json({
            code: 'PROFILE_UPDATED',
            message: 'Your profile has been updated.',
            data: {
                id: user.id
            }
        });
    }
);

handler.delete(async ({ payload }, res) => {
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

    await prisma.users.delete({
        where: {
            id: user.id
        }
    });

    return res.json({
        code: 'ACCOUNT_DELETED',
        message: 'Your account has been deleted.',
        data: {
            id: user.id
        }
    });
});

export default handler;
