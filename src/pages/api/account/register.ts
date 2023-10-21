import crypto from 'crypto';
import { ErrorResponse, UpdatedResponse } from '@/common/types';
import { registerSchema } from '@/features/account/accountTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { hashPassword } from '@/utils/hash';

const registerHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res
) => {
    const body = await registerSchema.validate(req.body);

    const existing = await prisma.users.findUnique({
        select: {
            id: true
        },
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
            emailAddress: body.emailAddress,
            password: await hashPassword(body.password),
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        id: result.id
    });
};

export default mapHandlers({
    post: registerHandler
});
