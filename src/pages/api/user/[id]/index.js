import * as Yup from 'yup';
import * as userRepository from '@/data/userRepository';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { getHandler } from '@/utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '@/utils/auth';

const handler = getHandler();

handler.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

handler.get(async ({ query }, res) => {
    const user = await userRepository.getById(query.id);

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
});

handler.put(
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
    async ({ query, body }, res) => {
        const user = await userRepository.getById(query.id);

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
    }
);

handler.delete(async ({ payload, query }, res) => {
    const user = await userRepository.getById(query.id);

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
});

export default handler;
