import { ProblemResponse, UpdatedResponse } from '@/features/base.types';
import { changePasswordSchema } from '@/features/manage/manage.types';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { hashPassword, verifyPassword } from '@/utils/hash';

const changePasswordHandler: Handler<
    UpdatedResponse | ProblemResponse
> = async (req, res, { currentUserId }) => {
    const body = await changePasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        where: {
            id: currentUserId
        }
    });

    if (!user) {
        return res.status(404).json({
            title: 'User not found.',
            status: 404
        });
    }

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            title: 'Data has been modified since entities were loaded.',
            status: 409
        });
    }

    if (!user.password) {
        return res.status(400).json({
            title: 'Incorrect password.',
            status: 400
        });
    }

    const verified = await verifyPassword(body.currentPassword, user.password);

    if (!verified) {
        return res.status(400).json({
            title: 'Incorrect password.',
            status: 400
        });
    }

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            password: await hashPassword(body.newPassword),
            passwordResetToken: null
        }
    });

    return res.json({
        id: user.id
    });
};

export default mapHandlers(
    {
        put: changePasswordHandler
    },
    { authorize: true }
);
