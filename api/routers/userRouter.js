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
    validationMiddleware({
        query: {
            search: Yup.string().label('Search'),
            sort: Yup.string()
                .label('Sort')
                .oneOf([
                    'NAME_ASC',
                    'NAME_DESC',
                    'EMAIL_ADDRESS_ASC',
                    'EMAIL_ADDRESS_DESC'
                ]),
            page: Yup.number().label('Page'),
            size: Yup.number().label('Size')
        }
    }),
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
                    id: user.user_id,
                    emailAddress: user.email_address,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    dateOfBirth: user.date_of_birth.toISOString(),
                    isLockedOut: user.is_locked_out,
                    roles: user.roles
                })),
                hasNextPage: result.has_next_page,
                hasPreviousPage: result.has_previous_page
            }
        });
    })
);

userRouter.post(
    '/',
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
            date_of_birth: body.dateOfBirth,
            is_locked_out: false,
            roles: body.roles
        });

        return res.json({
            code: 'USER_CREATED',
            message: 'User successfully created.',
            data: {
                id: result.user_id
            }
        });
    })
);

userRouter.get(
    '/:id',
    asyncMiddleware(async ({ params }, res) => {
        const user = await userRepository.getById(params.id);

        if (!user) {
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
                dateOfBirth: user.date_of_birth.toISOString(),
                isLockedOut: user.is_locked_out,
                roles: user.roles
            }
        });
    })
);

userRouter.put(
    '/:id',
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
    asyncMiddleware(async ({ params, body }, res) => {
        const user = await userRepository.getById(params.id);

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
        user.roles = body.roles;
        await userRepository.update(user);

        return res.json({
            code: 'USER_UPDATED',
            message: 'User successfully updated.',
            data: {
                id: user.user_id
            }
        });
    })
);

userRouter.put(
    '/:id/lock',
    asyncMiddleware(async ({ params, payload }, res) => {
        const user = await userRepository.getById(params.id);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.user_id === payload.sub) {
            return res.status(400).json({
                code: 'LOCK_CURRENT_USER',
                message: 'Cannot lock currently logged in user.'
            });
        }

        user.is_locked_out = true;
        await userRepository.update(user);

        return res.json({
            code: 'USER_LOCKED',
            message: 'User successfully locked.',
            data: {
                id: user.user_id
            }
        });
    })
);

userRouter.put(
    '/:id/unlock',
    asyncMiddleware(async ({ params }, res) => {
        const user = await userRepository.getById(params.id);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        user.is_locked_out = false;
        await userRepository.update(user);

        return res.json({
            code: 'USER_UNLOCKED',
            message: 'User successfully unlocked.',
            data: {
                id: user.user_id
            }
        });
    })
);

userRouter.delete(
    '/:id',
    asyncMiddleware(async ({ params, payload }, res) => {
        const user = await userRepository.getById(params.id);

        if (!user) {
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        if (user.user_id === payload.sub) {
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
                id: user.user_id
            }
        });
    })
);
