import { authMiddleware } from '@/middleware/authMiddleware';
import { getHandler } from '@/utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '@/utils/auth';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

handler.put(async ({ query }, res) => {
    const user = await prisma.users.findUnique({
        where: {
            user_id: parseInt(query.id)
        }
    });

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    await prisma.users.update({
        where: {
            user_id: user.user_id
        },
        data: {
            is_locked_out: false
        }
    });

    return res.json({
        code: 'USER_UNLOCKED',
        message: 'User successfully unlocked.',
        data: {
            id: user.user_id
        }
    });
});

export default handler;
