import crypto from 'crypto';
import { UpdatedResponse } from '@/models/base.types';
import { registerSchema } from '@/models/account.types';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { hashPassword } from '@/utils/hash';

const registerHandler: Handler<UpdatedResponse> = async (req, res) => {
    const body = await registerSchema.validate(req.body);

    const existing = await prisma.users.findUnique({
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (existing) {
        return res.status(400).json({
            title: 'User name is already taken.',
            status: 400
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
