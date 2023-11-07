import { resetPasswordSchema } from '@/features/account/accountTypes';
import { baseRouter, onError } from '@/utils/router';
import prisma from '@/utils/prisma';
import { hashPassword } from '@/utils/hash';

const router = baseRouter.clone();

router.put(async (req, res) => {
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
});

export default router.handler({
    onError
});
