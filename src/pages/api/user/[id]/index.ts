import crypto from 'crypto';
import { UpdatedResponse } from '@/models/base.types';
import {
    GetUserResponse,
    deleteUserSchema,
    getUserSchema,
    updateUserSchema
} from '@/models/user.types';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
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
            title: 'User not found.',
            status: 404
        });
    }

    return res.json({
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        isLockedOut: user.isLockedOut,
        roles: user.roles.map(r => r as Role),
        version: user.version
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
            title: 'User not found.',
            status: 404
        });
    }

    const body = await updateUserSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            title: 'Data has been modified since entities were loaded.',
            status: 409
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
                title: 'User name is already taken.',
                status: 400
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
            roles: body.roles,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        id: user.id
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
            title: 'User not found.',
            status: 404
        });
    }

    const body = await deleteUserSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            title: 'Data has been modified since entities were loaded.',
            status: 409
        });
    }

    if (user.id === currentUserId) {
        return res.status(400).json({
            title: 'Cannot delete currently logged in user.',
            status: 400
        });
    }

    await prisma.users.delete({
        where: {
            id: user.id
        }
    });

    return res.json({
        id: user.id
    });
};

export default mapHandlers(
    {
        get: getUserHandler,
        put: updateUserHandler,
        delete: deleteUserHandler
    },
    { authorize: isUserAdministrator }
);
