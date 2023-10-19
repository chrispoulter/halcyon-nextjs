import { createTokenSchema } from '@/models/token.types';
import prisma from '@/utils/prisma';
import { mapHandlers, Handler } from '@/utils/handler';
import { verifyPassword } from '@/utils/hash';
import { generateJwtToken } from '@/utils/jwt';

const createTokenHandler: Handler<string> = async (req, res) => {
    const body = await createTokenSchema.validate(req.body);

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

    const verified = await verifyPassword(body.password, user.password);

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

    const token = await generateJwtToken(user);

    return res.json({
        data: token
    });
};

export default mapHandlers({
    post: createTokenHandler
});
