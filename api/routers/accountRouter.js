import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { asyncMiddleware, validationMiddleware } from '../middleware';
import { userRepository } from '../data';
import { sendEmail } from '../utils/email';
import { generateHash } from '../utils/hash';

export const accountRouter = Router();

accountRouter.post(
    '/register',
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            password: Yup.string().label('Password').min(8).max(50).required(),
            firstName: Yup.string().label('First Name').max(50).required(),
            lastName: Yup.string().label('Last Name').max(50).required(),
            dateOfBirth: Yup.string().label('Date Of Birth').required()
        }
    }),
    asyncMiddleware(async ({ body }, res) => {
        const existing = await userRepository.getByEmailAddress(
            body.emailAddress
        );

        if (existing) {
            return res.status(400).json({
                code: 'DUPLICATE_USER',
                message: `User name "${body.emailAddress}" is already taken.`
            });
        }

        const result = await userRepository.create({
            email_address: body.emailAddress,
            password: await generateHash(body.password),
            first_name: body.firstName,
            last_name: body.lastName,
            date_of_birth: body.dateOfBirth
        });

        return res.json({
            code: 'USER_REGISTERED',
            message: 'User successfully registered.',
            data: {
                id: result.user_id
            }
        });
    })
);

accountRouter.put(
    '/forgotpassword',
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required()
        }
    }),
    asyncMiddleware(async (req, res) => {
        const user = await userRepository.getByEmailAddress(
            req.body.emailAddress
        );

        if (user) {
            user.password_reset_token = uuidv4();
            await userRepository.update(user);

            const siteUrl = `${req.protocol}://${req.get('host')}`;

            await sendEmail({
                to: user.email_address,
                template: 'RESET_PASSWORD',
                context: {
                    siteUrl,
                    passwordResetUrl: `${siteUrl}/reset-password/${user.password_reset_token}`
                }
            });
        }

        return res.json({
            code: 'FORGOT_PASSWORD',
            message:
                'Instructions as to how to reset your password have been sent to you via email.'
        });
    })
);

accountRouter.put(
    '/resetpassword',
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
    asyncMiddleware(async ({ body }, res) => {
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
    })
);
