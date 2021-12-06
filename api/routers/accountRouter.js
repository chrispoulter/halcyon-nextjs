import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncMiddleware } from '../middleware';
import { userRepository } from '../data';
import { sendEmail } from '../utils/email';
import { generateHash } from '../utils/hash';

export const accountRouter = Router();

accountRouter.post(
    '/register',
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
            emailAddress: body.emailAddress,
            password: await generateHash(body.password),
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth.toISOString()
        });

        return res.json({
            code: 'USER_REGISTERED',
            message: 'User successfully registered.',
            data: {
                id: result.id
            }
        });
    })
);

accountRouter.put(
    '/forgotpassword',
    asyncMiddleware(async (req, res) => {
        const user = await userRepository.getByEmailAddress(
            req.body.emailAddress
        );

        if (user) {
            user.passwordResetToken = uuidv4();
            await userRepository.update(user);

            const siteUrl = `${req.protocol}://${req.get('host')}`;

            await sendEmail({
                to: user.emailAddress,
                template: 'RESET_PASSWORD',
                context: {
                    siteUrl,
                    passwordResetUrl: `${siteUrl}/reset-password/${user.passwordResetToken}`
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
    asyncMiddleware(async ({ body }, res) => {
        const user = await userRepository.getByEmailAddress(body.emailAddress);

        if (!user || user.passwordResetToken !== body.token) {
            return res.status(400).json({
                code: 'INVALID_TOKEN',
                message: 'Invalid token.'
            });
        }

        user.password = await generateHash(body.newPassword);
        user.passwordResetToken = undefined;
        await userRepository.update(user);

        return res.json({
            code: 'PASSWORD_RESET',
            message: 'Your password has been reset.',
            data: {
                id: user.id
            }
        });
    })
);
