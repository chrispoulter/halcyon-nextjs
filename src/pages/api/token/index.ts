import { createTokenSchema } from '@/models/token.types';
import prisma from '@/utils/prisma';
import { handler, Handler } from '@/utils/handler';
import { verifyHash } from '@/utils/hash';
import { generateToken } from '@/utils/jwt';

const createTokenHandler: Handler<string> = async (req, res) => {
    const body = await createTokenSchema.parseAsync(req.body);

    const user = await prisma.users.findUnique({
        where: {
            emailAddress: body.emailAddress
        }
    });

    if (!user || !user.password) {
        return res.status(400).json({
            code: 'CREDENTIALS_INVALID',
            message: 'The credentials provided were invalid.'
        });
    }

    const verified = await verifyHash(body.password, user.password);

    if (!verified) {
        return res.status(400).json({
            code: 'CREDENTIALS_INVALID',
            message: 'The credentials provided were invalid.'
        });
    }

    if (user.isLockedOut) {
        return res.status(400).json({
            code: 'USER_LOCKED_OUT',
            message: 'This account has been locked out, please try again later.'
        });
    }

    const token = await generateToken(user);

    return res.json({
        data: token
    });
};

export default handler({
    post: createTokenHandler
});
