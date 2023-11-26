import { registerSchema } from '@/features/account/accountTypes';
import { createUser, getUserByEmailAddress } from '@/data/userRepository';
import { createApiRouter, onError } from '@/utils/router';

const router = createApiRouter();

router.post(async (req, res) => {
    const body = await registerSchema.validate(req.body, {
        stripUnknown: true
    });

    const existing = await getUserByEmailAddress(body.emailAddress);

    if (existing) {
        return res.status(400).json({
            message: 'User name is already taken.'
        });
    }

    const id = await createUser(body);

    return res.json({
        id
    });
});

export default router.handler({
    onError
});
