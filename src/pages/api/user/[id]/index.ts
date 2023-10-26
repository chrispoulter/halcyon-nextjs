import { ErrorResponse, UpdatedResponse } from '@/common/commonTypes';
import {
    GetUserResponse,
    deleteUserSchema,
    getUserSchema,
    updateUserSchema
} from '@/features/user/userTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { isUserAdministrator } from '@/utils/auth';

const getUserHandler: Handler<GetUserResponse | ErrorResponse> = async (
    req,
    res
) => {
    const query = await getUserSchema.validate(req.query);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            emailAddress: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            isLockedOut: true,
            version: true,
            roles: true
        },
        where: {
            id: query.id
        }
    });

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    return res.json({
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth.toISOString().split('T')[0],
        isLockedOut: user.isLockedOut,
        roles: user.roles,
        version: user.version!
    });
};

const updateUserHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res
) => {
    const query = await getUserSchema.validate(req.query);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            emailAddress: true,
            version: true
        },
        where: {
            id: query.id
        }
    });

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await updateUserSchema.validate(req.body, {
        stripUnknown: true
    });

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.emailAddress !== body.emailAddress) {
        const existing = await prisma.users.count({
            where: {
                emailAddress: body.emailAddress
            }
        });

        if (existing) {
            return res.status(400).json({
                message: 'User name is already taken.'
            });
        }
    }

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            ...body,
            dateOfBirth: `${body.dateOfBirth}T00:00:00.000Z`,
            search: `${body.emailAddress} ${body.firstName} ${body.lastName}`,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        id: user.id
    });
};

const deleteUserHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res,
    { currentUserId }
) => {
    const query = await getUserSchema.validate(req.query);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            version: true
        },
        where: {
            id: query.id
        }
    });

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await deleteUserSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.id === currentUserId) {
        return res.status(400).json({
            message: 'Cannot delete currently logged in user.'
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
