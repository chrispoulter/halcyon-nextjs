import * as Yup from 'yup';
import * as userRepository from '../../../_api/data/userRepository';
import { validationMiddleware } from '../../../_api/middleware/validationMiddleware';
import * as jwtService from '../../../_api/services/jwtService';
import * as hashService from '../../../_api/services/hashService';
import { getHandler } from '../../../_api/utils/handler';

const handler = getHandler();

handler.post(
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .email()
                .required(),
            password: Yup.string().label('Password').required()
        }
    }),
    async ({ body }, res) => {
        const user = await userRepository.getByEmailAddress(body.emailAddress);

        if (!user || !user.password) {
            return res.status(400).json({
                code: 'CREDENTIALS_INVALID',
                message: 'The credentials provided were invalid.'
            });
        }

        const verified = await hashService.verifyHash(
            body.password,
            user.password
        );

        if (!verified) {
            return res.status(400).json({
                code: 'CREDENTIALS_INVALID',
                message: 'The credentials provided were invalid.'
            });
        }

        if (user.is_locked_out) {
            return res.status(400).json({
                code: 'USER_LOCKED_OUT',
                message:
                    'This account has been locked out, please try again later.'
            });
        }

        return res.json({
            data: jwtService.generateToken(user)
        });
    }
);

export default handler;
