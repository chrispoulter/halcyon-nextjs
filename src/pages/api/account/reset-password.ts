import { resetPasswordSchema } from '@/features/account/accountTypes';
import { getUserByEmailAddress, setUserPassword } from '@/data/userRepository';
import { createApiRouter, onError } from '@/utils/router';

const router = createApiRouter();

router.put(async (req, res) => {
    const body = await resetPasswordSchema.validate(req.body);

    const user = await getUserByEmailAddress(body.emailAddress);

    if (!user || user.passwordResetToken !== body.token) {
        return res.status(400).json({
            message: 'Invalid token.'
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
