import { getUserSchema, lockUserSchema } from '@/features/user/userTypes';
import { getUserById, setUserIsLockedOut } from '@/data/userRepository';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { isUserAdministrator } from '@/utils/auth';

const router = createApiRouter();

router.use(authorize(isUserAdministrator));

router.put(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const user = await getUserById(params.id);

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

    if (user.id === req.currentUserId) {
        return res.status(400).json({
            message: 'Cannot lock currently logged in user.'
        });
    }

    await setUserIsLockedOut(user.id, true);

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
