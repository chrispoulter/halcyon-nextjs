import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { registerSchema } from '@/features/account/accountTypes';
import { onError } from '@/utils/router';
import prisma from '@/utils/prisma';
import { hashPassword } from '@/utils/hash';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
    const body = await registerSchema.validate(req.body, {
        stripUnknown: true
    });

    const existing = await prisma.users.count({
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (existing) {
        return res.status(400).json({
            message: 'User name is already taken.'
        });
    }

    const result = await prisma.users.create({
        data: {
            ...body,
            password: await hashPassword(body.password),
            dateOfBirth: `${body.dateOfBirth}T00:00:00.000Z`,
            search: `${body.emailAddress} ${body.firstName} ${body.lastName}`,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        id: result.id
    });
});

export default router.handler({
    onError
});
