import * as Yup from 'yup';
import * as userRepository from '@/data/userRepository';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { generateHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';

const handler = getHandler();

handler.put(
    validationMiddleware({
        body: {
            token: Yup.string().label('Token').required(),
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            newPassword: Yup.string()
                .label('New Password')
                .min(8)
                .max(50)
                .required()
        }
    }),
    async ({ body }, res) => {
        const user = await userRepository.getByEmailAddress(body.emailAddress);

        if (!user || user.password_reset_token !== body.token) {
            return res.status(400).json({
                code: 'INVALID_TOKEN',
                message: 'Invalid token.'
            });
        }

        user.password = await generateHash(body.newPassword);
        user.password_reset_token = undefined;
        await userRepository.update(user);

        return res.json({
            code: 'PASSWORD_RESET',
            message: 'Your password has been reset.',
            data: {
                id: user.user_id
            }
        });
    }
);

export default handler;
