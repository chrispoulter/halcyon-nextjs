import * as Yup from 'yup';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import { generateHash } from '@/utils/hash';
import { getHandler } from '@/utils/handler';
import { USER_ADMINISTRATOR_ROLES } from '@/utils/auth';
import prisma from '@/utils/prisma';

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
        const search = query.search;
        const sort = query.sort || 'NAME_ASC';
        const page = Math.max(query.page || 1, 1);
        const take = Math.min(query.size || 50, 50);

        let where;

        if (search) {
            where = {
                OR: [
                    {
                        emailAddress: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        firstName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        lastName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            };
        }

        const count = await prisma.users.count({ where });

        let orderBy;

        switch (sort) {
            case 'EMAIL_ADDRESS_ASC':
                orderBy = {
                    emailAddress: 'asc'
                };
                break;
            case 'EMAIL_ADDRESS_DESC':
                orderBy = {
                    emailAddress: 'desc'
                };
                break;
            case 'NAME_DESC':
                orderBy = [{ firstName: 'desc' }, { lastName: 'desc' }];
                break;
            default:
                orderBy = [{ firstName: 'asc' }, { lastName: 'asc' }];
                break;
        }

        const skip = (page - 1) * take;

        const users = await prisma.users.findMany({
            where,
            orderBy,
            skip,
            take
        });

        const pageCount = Math.floor((count + take - 1) / take);
        const hasNextPage = page < pageCount;
        const hasPreviousPage = page > 1;

        return res.json({
            data: {
                items: users.map(user => ({
                    id: user.id,
                    emailAddress: user.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth.toISOString(),
                    isLockedOut: user.isLockedOut,
                    roles: user.roles
                })),
                hasNextPage,
                hasPreviousPage
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
        const existing = await prisma.users.findUnique({
            where: {
                emailAddress: body.emailAddress
            }
        });

        if (existing) {
            return res.status(400).json({
                code: 'DUPLICATE_USER',
                message: `User name "${body.emailAddress}" is already taken.`
            });
        }

        const result = await prisma.users.create({
            data: {
                emailAddress: body.emailAddress,
                password: await generateHash(body.password),
                firstName: body.firstName,
                lastName: body.lastName,
                dateOfBirth: body.dateOfBirth,
                roles: body.roles
            }
        });

        return res.json({
            code: 'USER_CREATED',
            message: 'User successfully created.',
            data: {
                id: result.id
            }
        });
    }
);

export default handler;
