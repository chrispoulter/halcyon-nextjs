import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import * as userRepository from '../data/userRepository';
import { validationMiddleware } from '../middleware/validationMiddleware';
import * as emailService from '../services/emailService';
import { getHandler } from '../utils/handler';

const handler = getHandler();

handler.put(
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required()
        }
    }),
    async (req, res) => {
        const user = await userRepository.getByEmailAddress(
            req.body.emailAddress
        );

        if (user) {
            user.password_reset_token = uuidv4();
            await userRepository.update(user);

            const protocol = req.headers.referer?.split('://')[0];
            const host = req.headers.host;
            const siteUrl = `${protocol}://${host}`;

            await emailService.sendEmail({
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
    }
);

export default handler;
