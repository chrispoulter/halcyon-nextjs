import * as Yup from 'yup';
import * as userRepository from '../../../data/userRepository';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { validationMiddleware } from '../../../middleware/validationMiddleware';
import * as hashService from '../../../services/hashService';
import { getHandler } from '../../../utils/handler';

const handler = getHandler();

handler.use(authMiddleware());

handler.put(
    validationMiddleware({
        body: {
            currentPassword: Yup.string().label('Current Password').required(),
            newPassword: Yup.string()
                .label('New Password')
                .min(8)
                .max(50)
                .required()
        }
    }),
    async ({ payload, body }, res) => {
        const user = await userRepository.getById(payload.sub);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        const verified = await hashService.verifyHash(
            body.currentPassword,
            user.password
        );

        if (!verified) {
            return res.status(400).json({
                code: 'INCORRECT_PASSWORD',
                message: 'Incorrect password.'
            });
        }

        user.password = await hashService.generateHash(body.newPassword);
        user.password_reset_token = undefined;
        await userRepository.update(user);

        return res.json({
            code: 'PASSWORD_CHANGED',
            message: 'Your password has been changed.',
            data: {
                id: user.user_id
            }
        });
    }
);

export default handler;
