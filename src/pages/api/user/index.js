import * as Yup from 'yup';
import * as userRepository from '../../../data/userRepository';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { validationMiddleware } from '../../../middleware/validationMiddleware';
import { generateHash } from '../../../utils/hash';
import { getHandler } from '../../../utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '../../../utils/auth';

const handler = getHandler();

handler.use(authMiddleware(USER_ADMINISTRATOR_ROLES));

handler.get(
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
    async ({ query }, res) => {
        const result = await userRepository.search(query);

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
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPreviousPage
            }
        });
    }
);

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
            date_of_birth: body.dateOfBirth,
            roles: body.roles
        });

        return res.json({
            code: 'USER_CREATED',
            message: 'User successfully created.',
            data: {
                id: result.user_id
            }
        });
    }
);

export default handler;
