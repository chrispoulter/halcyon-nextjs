import { authMiddleware } from '@/middleware/authMiddleware';
import { getHandler } from '@/utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '@/utils/auth';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

handler.put(async ({ payload, query }, res) => {
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
            code: 'LOCK_CURRENT_USER',
            message: 'Cannot lock currently logged in user.'
        });
    }

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            isLockedOut: true
        }
    });

    return res.json({
        code: 'USER_LOCKED',
        message: 'User successfully locked.',
        data: {
            id: user.id
        }
    });
});

export default handler;
