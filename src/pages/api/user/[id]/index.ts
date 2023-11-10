import {
    deleteUserSchema,
    getUserSchema,
    updateUserSchema
} from '@/features/user/userTypes';
import {
    deleteUser,
    getUserByEmailAddress,
    getUserById,
    updateUser
} from '@/data/userRepository';
import { createApiRouter, onError, authorize } from '@/utils/router';
import { isUserAdministrator } from '@/utils/auth';

const router = createApiRouter();

router.use(authorize(isUserAdministrator));

router.get(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const user = await getUserById(params.id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    return res.json(user);
});

router.put(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const user = await getUserById(params.id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await updateUserSchema.validate(req.body, {
        stripUnknown: true
    });

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.emailAddress !== body.emailAddress) {
        const existing = await getUserByEmailAddress(body.emailAddress);

        if (existing) {
            return res.status(400).json({
                message: 'User name is already taken.'
            });
        }
    }

    await updateUser({
        id: user.id,
        emailAddress: body.emailAddress,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        roles: body.roles
    });

    return res.json({
        id: user.id
    });
});

router.delete(async (req, res) => {
    const params = await getUserSchema.validate(req.query);

    const user = await getUserById(params.id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await deleteUserSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
        });
    }

    if (user.id === req.currentUserId) {
        return res.status(400).json({
            message: 'Cannot delete currently logged in user.'
        });
    }

    await deleteUser(user.id);

    return res.json({
        id: user.id
    });
});

export default router.handler({
    onError
});
