import { ErrorResponse, UpdatedResponse } from '@/common/types';
import { resetPasswordSchema } from '@/features/account/accountTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { hashPassword } from '@/utils/hash';

const resetPasswordHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res
) => {
    const body = await resetPasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            passwordResetToken: true
        },
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (!user || user.passwordResetToken !== body.token) {
        return res.status(400).json({
            message: 'Invalid token.'
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

export default mapHandlers({
    put: resetPasswordHandler
});
