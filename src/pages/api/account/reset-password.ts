import { UpdatedResponse } from '@/models/base.types';
import { resetPasswordSchema } from '@/models/account.types';
import prisma from '@/utils/prisma';
import { handler, Handler } from '@/utils/handler';
import { generateHash } from '@/utils/hash';

const resetPasswordHandler: Handler<UpdatedResponse> = async (req, res) => {
    const body = await resetPasswordSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (!user || user.passwordResetToken !== body.token) {
        return res.status(400).json({
            code: 'INVALID_TOKEN',
            message: 'Invalid token.'
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
        code: 'PASSWORD_RESET',
        message: 'Your password has been reset.',
        data: {
            id: user.id
        }
    });
};

export default handler({
    put: resetPasswordHandler
});
