import { createUserSchema, searchUsersSchema } from '@/features/user/userTypes';
import {
    createUser,
    getUserByEmailAddress,
    searchUsers
} from '@/data/userRepository';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { isUserAdministrator } from '@/utils/auth';

const router = createApiRouter();

router.use(authorize(isUserAdministrator));

router.get(async (req, res) => {
    const params = await searchUsersSchema.validate(req.query);

    const result = await searchUsers(
        params.page,
        params.size,
        params.sort,
        params.search
    );

    return res.json(result);
});

router.post(async (req, res) => {
    const body = await createUserSchema.validate(req.body, {
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
