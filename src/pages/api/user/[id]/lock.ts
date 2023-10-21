import crypto from 'crypto';
import { ErrorResponse, UpdatedResponse } from '@/common/types';
import { getUserSchema, lockUserSchema } from '@/features/user/userTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { isUserAdministrator } from '@/utils/auth';

const lockUserHandler: Handler<UpdatedResponse | ErrorResponse> = async (
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
            message: 'User not found.'
        });
    }

    const body = await lockUserSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.id === currentUserId) {
        return res.status(400).json({
            message: 'Cannot lock currently logged in user.'
        });
    }

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            isLockedOut: true,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        id: user.id
    });
};

export default mapHandlers(
    {
        put: lockUserHandler
    },
    { authorize: isUserAdministrator }
);
