import * as Yup from 'yup';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { getHandler } from '@/utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '@/utils/auth';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

handler.get(async ({ query }, res) => {
    const user = await prisma.users.findUnique({
        where: {
            id: parseInt(query.id)
        }
    });

    if (!user) {
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
            dateOfBirth: user.dateOfBirth.toISOString(),
            isLockedOut: user.isLockedOut,
            roles: user.roles
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
    async ({ query, body }, res) => {
        const user = await prisma.users.findUnique({
            where: {
                id: parseInt(query.id)
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
                dateOfBirth: body.dateOfBirth,
                roles: body.roles
            }
        });

        return res.json({
            code: 'USER_UPDATED',
            message: 'User successfully updated.',
            data: {
                id: user.id
            }
        });
    }
);

handler.delete(async ({ payload, query }, res) => {
    const user = await prisma.users.findUnique({
        where: {
            id: parseInt(query.id)
        }
    });

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    if (user.id === payload.sub) {
        return res.status(400).json({
            code: 'DELETE_CURRENT_USER',
            message: 'Cannot delete currently logged in user.'
        });
    }

    await prisma.users.delete({
        where: {
            id: user.id
        }
    });

    return res.json({
        code: 'USER_DELETED',
        message: 'User successfully deleted.',
        data: {
            id: user.id
        }
    });
});

export default handler;
