import { Router } from 'express';
import * as Yup from 'yup';
import {
    asyncMiddleware,
    authMiddleware,
    validationMiddleware
} from '../middleware';
import { userRepository } from '../data';
import { hashService } from '../services';

export const manageRouter = Router();

manageRouter.use(authMiddleware());

manageRouter.get(
    '/',
    asyncMiddleware(async ({ payload }, res) => {
        const user = await userRepository.getById(payload.sub);

        if (!user || user.is_locked_out) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        return res.json({
            data: {
                id: user.user_id,
                emailAddress: user.email_address,
                firstName: user.first_name,
                lastName: user.last_name,
                dateOfBirth: user.date_of_birth.toISOString()
            }
        });
    })
);

manageRouter.put(
    '/',
    validationMiddleware({
        body: {
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            firstName: Yup.string().label('First Name').max(50).required(),
            lastName: Yup.string().label('Last Name').max(50).required(),
            dateOfBirth: Yup.string().label('Date Of Birth').required()
        }
    }),
    asyncMiddleware(async ({ payload, body }, res) => {
        const user = await userRepository.getById(payload.sub);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.email_address !== body.emailAddress) {
            const existing = await userRepository.getByEmailAddress(
                body.emailAddress
            );

            if (existing) {
                return res.status(400).json({
                    code: 'DUPLICATE_USER',
                    message: `User name "${body.emailAddress}" is already taken.`
                });
            }
        }

        user.email_address = body.emailAddress;
        user.first_name = body.firstName;
        user.last_name = body.lastName;
        user.date_of_birth = body.dateOfBirth;
        await userRepository.update(user);

        return res.json({
            code: 'PROFILE_UPDATED',
            message: 'Your profile has been updated.',
            data: {
                id: user.user_id
            }
        });
    })
);

manageRouter.put(
    '/changepassword',
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
    asyncMiddleware(async ({ payload, body }, res) => {
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
    })
);

manageRouter.delete(
    '/',
    asyncMiddleware(async ({ payload }, res) => {
        const user = await userRepository.getById(payload.sub);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        await userRepository.remove(user);

        return res.json({
            code: 'ACCOUNT_DELETED',
            message: 'Your account has been deleted.',
            data: {
                id: user.user_id
            }
        });
    })
);
