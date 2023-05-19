import {
    GetUserResponse,
    getUserSchema,
    updateUserSchema
} from '@/models/user.types';
import prisma from '@/utils/prisma';
import { handler, Handler, UpdatedResponse } from '@/utils/handler';
import { Role, isUserAdministrator } from '@/utils/auth';

const getUserHandler: Handler<GetUserResponse> = async (req, res) => {
    const query = await getUserSchema.validate(req.query);

    const user = await prisma.users.findUnique({
        where: {
            id: query.id
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
            dateOfBirth: user.dateOfBirth,
            isLockedOut: user.isLockedOut,
            roles: user.roles.map(r => r as Role)
        }
    });
};

const updateUserHandler: Handler<UpdatedResponse> = async (req, res) => {
    const query = await getUserSchema.validate(req.query);

    const user = await prisma.users.findUnique({
        where: {
            id: query.id
        }
    });

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    const body = await updateUserSchema.validate(req.body);

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
};

const deleteUserHandler: Handler<UpdatedResponse> = async (
    req,
    res,
    { currentUserId }
) => {
    const query = await getUserSchema.validate(req.query);

    const user = await prisma.users.findUnique({
        where: {
            id: query.id
        }
    });

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    if (user.id === currentUserId) {
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
};

export default handler(
    {
        get: getUserHandler,
        put: updateUserHandler,
        delete: deleteUserHandler
    },
    { auth: isUserAdministrator }
);
