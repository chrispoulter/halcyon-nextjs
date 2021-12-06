import { Router } from 'express';
import * as Yup from 'yup';
import {
    asyncMiddleware,
    authMiddleware,
    validationMiddleware
} from '../middleware';
import { userRepository } from '../data';
import { verifyHash, generateHash } from '../utils/hash';

export const manageRouter = Router();

manageRouter.use(authMiddleware());

manageRouter.get(
    '/',
    asyncMiddleware(({ payload }, res) => {
        const user = userRepository.getById(payload.sub);

        if (!user || user.IsLockedOut) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        return res.json({
            data: {
                id: user.id,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth.toISOString()
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

        if (user.emailAddress !== body.emailAddress) {
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

        user.emailAddress = body.emailAddress;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.dateOfBirth = body.dateOfBirth.toISOString();
        await userRepository.update(user);

        return res.json({
            code: 'PROFILE_UPDATED',
            message: 'Your profile has been updated.',
            data: {
                id: user.id
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

        const verified = await verifyHash(body.currentPassword, user.password);

        if (!verified) {
            return res.status(400).json({
                code: 'INCORRECT_PASSWORD',
                message: 'Incorrect password.'
            });
        }

        user.password = await generateHash(body.newPassword);
        user.passwordResetToken = undefined;
        await userRepository.update(user);

        return res.json({
            code: 'PASSWORD_CHANGED',
            message: 'Your password has been changed.',
            data: {
                id: user.id
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
                id: user.id
            }
        });
    })
);
