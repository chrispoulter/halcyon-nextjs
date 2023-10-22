import { ErrorResponse, UpdatedResponse } from '@/common/types';
import { registerSchema } from '@/features/account/accountTypes';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { hashPassword } from '@/utils/hash';

const registerHandler: Handler<UpdatedResponse | ErrorResponse> = async (
    req,
    res
) => {
    const body = await registerSchema.validate(req.body, {
        stripUnknown: true
    });

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
            ...body,
            password: await hashPassword(body.password)
        }
    });

    return res.json({
        id: result.id
    });
};

export default mapHandlers({
    post: registerHandler
});
