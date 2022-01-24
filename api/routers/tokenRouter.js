import { Router } from 'express';
import * as Yup from 'yup';
import { asyncMiddleware, validationMiddleware } from '../middleware';
import { userRepository } from '../data';
import { hashService, jwtService } from '../services';

export const tokenRouter = Router();

tokenRouter.post(
    '/',
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .email()
                .required(),
            password: Yup.string().label('Password').required()
        }
    }),
    asyncMiddleware(async ({ body }, res) => {
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
    })
);
