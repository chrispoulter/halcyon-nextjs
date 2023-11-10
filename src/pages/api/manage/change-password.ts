import { changePasswordSchema } from '@/features/manage/manageTypes';
import { getUserById, setUserPassword } from '@/data/userRepository';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { verifyPassword } from '@/utils/hash';

const router = createApiRouter();

router.use(authorize());

router.put(async (req, res) => {
    const body = await changePasswordSchema.validate(req.body);

    const user = await getUserById(req.currentUserId);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (!user.password) {
        return res.status(400).json({
            message: 'Incorrect password.'
        });
    }

    const verified = await verifyPassword(body.currentPassword, user.password);

    if (!verified) {
        return res.status(400).json({
            message: 'Incorrect password.'
        });
    }

    await setUserPassword(user.id, body.newPassword);

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
