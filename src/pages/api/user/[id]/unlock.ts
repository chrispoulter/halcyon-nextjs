import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { getUserSchema, unlockUserSchema } from '@/features/user/userTypes';
import {
    onError,
    authorize,
    AuthenticatedNextApiRequest
} from '@/utils/router';
import prisma from '@/utils/prisma';
import { isUserAdministrator } from '@/utils/auth';

const router = createRouter<AuthenticatedNextApiRequest, NextApiResponse>();

router.use(authorize(isUserAdministrator));

router.put(async (req, res) => {
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
});

export default router.handler({
    onError
});
