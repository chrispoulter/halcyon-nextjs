import * as Yup from 'yup';
import * as userRepository from '../../../_api/data/userRepository';
import { authMiddleware } from '../../../_api/middleware/authMiddleware';
import { validationMiddleware } from '../../../_api/middleware/validationMiddleware';
import { getHandler } from '../../../_api/utils/handler';

const handler = getHandler();

handler.use(authMiddleware());

handler.get(async ({ payload }, res) => {
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
    async ({ payload, body }, res) => {
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
    }
);

handler.delete(async ({ payload }, res) => {
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
});

export default handler;
