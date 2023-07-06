import { changePasswordSchema } from '@/models/manage.types';
import prisma from '@/utils/prisma';
import { handler, Handler, UpdatedResponse } from '@/utils/handler';
import { generateHash, verifyHash } from '@/utils/hash';

const changePasswordHandler: Handler<UpdatedResponse> = async (
    req,
    res,
    { currentUserId }
) => {
    const body = await changePasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        where: {
            id: currentUserId
        }
    });

    if (!user) {
        return res.status(404).json({
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
        });
    }

    if (body.version && body.version !== user.version) {
        return res.status(409).json({
            code: 'CONFLICT',
            message:
                'Data has been modified or deleted since entities were loaded.'
        });
    }

    if (!user.password) {
        return res.status(400).json({
            code: 'INCORRECT_PASSWORD',
            message: 'Incorrect password.'
        });
    }

    const verified = await verifyHash(body.currentPassword, user.password);

    if (!verified) {
        return res.status(400).json({
            code: 'INCORRECT_PASSWORD',
            message: 'Incorrect password.'
        });
    }

    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            password: await generateHash(body.newPassword),
            passwordResetToken: null
        }
    });

    return res.json({
        code: 'PASSWORD_CHANGED',
        message: 'Your password has been changed.',
        data: {
            id: user.id
        }
    });
};

export default handler(
    {
        put: changePasswordHandler
    },
    { auth: true }
);
