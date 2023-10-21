import crypto from 'crypto';
import { ErrorResponse, UpdatedResponse } from '@/common/types';
import { getUserSchema, unlockUserSchema } from '@/features/user/userTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { isUserAdministrator } from '@/utils/auth';

const unlockUserHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res
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

    const body = await unlockUserSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            isLockedOut: false,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        id: user.id
    });
};

export default mapHandlers(
    {
        put: unlockUserHandler
    },
    { authorize: isUserAdministrator }
);
