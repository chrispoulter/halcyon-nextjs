import * as userRepository from '../../../../_api/data/userRepository';
import { authMiddleware } from '../../../../_api/middleware/authMiddleware';
import { getHandler } from '../../../../_api/utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '../../../../_api/utils/auth';

const handler = getHandler();

handler.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

handler.put(async ({ query }, res) => {
    const user = await userRepository.getById(query.id);

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    user.is_locked_out = false;
    await userRepository.update(user);

    return res.json({
        code: 'USER_UNLOCKED',
        message: 'User successfully unlocked.',
        data: {
            id: user.user_id
        }
    });
});

export default handler;
