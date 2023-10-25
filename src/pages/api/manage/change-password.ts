import { ErrorResponse, UpdatedResponse } from '@/common/commonTypes';
import { changePasswordSchema } from '@/features/manage/manageTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { hashPassword, verifyPassword } from '@/utils/hash';

const changePasswordHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res,
    { currentUserId }
) => {
    const body = await changePasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            password: true,
            version: true
        },
        where: {
            id: currentUserId
        }
    });

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

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            password: await hashPassword(body.newPassword),
            passwordResetToken: null,
            version: crypto.randomUUID()
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
