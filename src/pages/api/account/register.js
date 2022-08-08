import * as Yup from 'yup';
import * as userRepository from '../../../data/userRepository';
import { validationMiddleware } from '../../../middleware/validationMiddleware';
import { generateHash } from '../../../utils/hash';
import { getHandler } from '../../../utils/handler';

const handler = getHandler();

handler.post(
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
    async ({ body }, res) => {
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
    }
);

export default handler;
