import { registerSchema } from '@/models/account.types';
import prisma from '@/utils/prisma';
import { handler, Handler, UpdatedResponse } from '@/utils/handler';
import { generateHash } from '@/utils/hash';

const registerHandler: Handler<UpdatedResponse> = async (req, res) => {
    const body = await registerSchema.parseAsync(req.body);

    const existing = await prisma.users.findUnique({
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (existing) {
        return res.status(400).json({
            code: 'DUPLICATE_USER',
            message: `User name "${body.emailAddress}" is already taken.`
        });
    }

    const result = await prisma.users.create({
        data: {
            emailAddress: body.emailAddress,
            password: await generateHash(body.password),
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        code: 'USER_REGISTERED',
        message: 'User successfully registered.',
        data: {
            id: result.id
        }
    });
};

export default handler({
    post: registerHandler
});
