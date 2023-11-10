import {
    deleteAccountSchema,
    updateProfileSchema
} from '@/features/manage/manageTypes';
import {
    deleteUser,
    getUserByEmailAddress,
    getUserById,
    updateUser
} from '@/data/userRepository';
import { createApiRouter, onError, authorize } from '@/utils/router';

const router = createApiRouter();

router.use(authorize());

router.get(async (req, res) => {
    const user = await getUserById(req.currentUserId);

    if (!user || user.isLockedOut) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    return res.json({
        id: user.id,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        version: user.version
    });
});

router.put(async (req, res) => {
    const body = await updateProfileSchema.validate(req.body);

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
        roles: user.roles
    });

    return res.json({
        id: user.id
    });
});

router.delete(async (req, res) => {
    const user = await getUserById(req.currentUserId);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    const body = await deleteAccountSchema.validate(req.body);

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            message: 'Data has been modified since entities were loaded.'
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
