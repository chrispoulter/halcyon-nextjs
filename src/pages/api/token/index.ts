import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { createTokenSchema } from '@/features/token/tokenTypes';
import { onError } from '@/utils/router';
import prisma from '@/utils/prisma';
import { verifyPassword } from '@/utils/hash';
import { generateJwtToken } from '@/utils/jwt';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
    const body = await createTokenSchema.validate(req.body);

    const user = await prisma.users.findUnique({
        select: {
            id: true,
            emailAddress: true,
            firstName: true,
            lastName: true,
            password: true,
            isLockedOut: true,
            roles: true
        },
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (!user || !user.password) {
        return res.status(400).json({
            message: 'The credentials provided were invalid.'
        });
    }

    const verified = await verifyPassword(body.password, user.password);

    if (!verified) {
        return res.status(400).json({
            message: 'The credentials provided were invalid.'
        });
    }

    if (user.isLockedOut) {
        return res.status(400).json({
            message: 'This account has been locked out, please try again later.'
        });
    }

    const token = await generateJwtToken(user);

    return res.send(token);
});

export default router.handler({
    onError
});
