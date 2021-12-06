import { Router } from 'express';
import * as Yup from 'yup';
import {
    asyncMiddleware,
    authMiddleware,
    validationMiddleware
} from '../middleware';
import { userRepository } from '../data';
import { USER_ADMINISTRATOR_ROLES } from '../utils/auth';
import { generateHash } from '../utils/hash';

export const userRouter = Router();

userRouter.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

userRouter.get(
    '/',
    asyncMiddleware(async ({ body }, res) => {
        const result = await userRepository.search({
            search: body.search,
            sort: body.sort,
            page: body.page,
            size: body.size
        });

        return res.json({
            data: {
                items: result.data.map(user => ({
                    id: user.id,
                    emailAddress: user.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth.toISOString(),
                    isLockedOut: user.isLockedOut,
                    roles: user.roles
                })),
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPreviousPage
            }
        });
    })
);

userRouter.post(
    '/',
    validationMiddleware(
        Yup.object().shape({
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            password: Yup.string().label('Password').min(8).max(50).required(),
            firstName: Yup.string().label('First Name').max(50).required(),
            lastName: Yup.string().label('Last Name').max(50).required(),
            dateOfBirth: Yup.string().label('Date Of Birth').required()
        })
    ),
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
            dateOfBirth: body.dateOfBirth.toISOString(),
            roles: body.roles
        });

        return res.json({
            code: 'USER_CREATED',
            message: 'User successfully created.',
            data: {
                id: result.id
            }
        });
    })
);

userRouter.get(
    '/:userId',
    asyncMiddleware(async ({ params }, res) => {
        const user = userRepository.getById(params.userId);

        if (!user) {
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
                dateOfBirth: user.dateOfBirth.toISOString(),
                isLockedOut: user.isLockedOut,
                roles: user.roles
            }
        });
    })
);

userRouter.put(
    '/:userId',
    validationMiddleware(
        Yup.object().shape({
            emailAddress: Yup.string()
                .label('Email Address')
                .max(254)
                .email()
                .required(),
            firstName: Yup.string().label('First Name').max(50).required(),
            lastName: Yup.string().label('Last Name').max(50).required(),
            dateOfBirth: Yup.string().label('Date Of Birth').required()
        })
    ),
    asyncMiddleware(async ({ params, body }, res) => {
        const user = await userRepository.getById(params.userId);

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
        user.roles = body.roles;
        await userRepository.update(user);

        return res.json({
            code: 'USER_UPDATED',
            message: 'User successfully updated.',
            data: {
                id: user.id
            }
        });
    })
);

userRouter.put(
    '/:userId/lock',
    asyncMiddleware(async ({ params, payload }, res) => {
        const user = await userRepository.getById(params.userId);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.id === payload.sub) {
            return res.status(400).json({
                code: 'LOCK_CURRENT_USER',
                message: 'Cannot lock currently logged in user.'
            });
        }

        user.isLockedOut = true;
        await userRepository.update(user);

        return res.json({
            code: 'USER_LOCKED',
            message: 'User successfully locked.',
            data: {
                id: user.id
            }
        });
    })
);

userRouter.put(
    '/:userId/unlock',
    asyncMiddleware(async ({ params }, res) => {
        const user = await userRepository.getById(params.userId);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        user.isLockedOut = false;
        await userRepository.update(user);

        return res.json({
            code: 'USER_UNLOCKED',
            message: 'User successfully unlocked.',
            data: {
                id: user.id
            }
        });
    })
);

userRouter.delete(
    '/:userId',
    asyncMiddleware(async ({ params, payload }, res) => {
        const user = await userRepository.getById(params.userId);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.id === payload.sub) {
            return res.status(400).json({
                code: 'DELETE_CURRENT_USER',
                message: 'Cannot delete currently logged in user.'
            });
        }

        await userRepository.remove(user);

        return res.json({
            code: 'USER_DELETED',
            message: 'User successfully deleted.',
            data: {
                id: user.id
            }
        });
    })
);
