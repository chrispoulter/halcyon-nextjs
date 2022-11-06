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
                        email_address: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        first_name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        last_name: {
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
                    email_address: 'asc'
                };
                break;
            case 'EMAIL_ADDRESS_DESC':
                orderBy = {
                    email_address: 'desc'
                };
                break;
            case 'NAME_DESC':
                orderBy = [{ first_name: 'desc' }, { last_name: 'desc' }];
                break;
            default:
                orderBy = [{ first_name: 'asc' }, { last_name: 'asc' }];
                break;
        }

        const skip = (page - 1) * take;

        const users = await prisma.users.findMany({
            where,
            include: {
                user_roles: {
                    select: {
                        roles: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
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
                    id: user.user_id,
                    emailAddress: user.email_address,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    dateOfBirth: user.date_of_birth.toISOString(),
                    isLockedOut: user.is_locked_out,
                    roles: (user.user_roles || []).map(ur => ur.roles.name)
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
                email_address: body.emailAddress
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
                email_address: body.emailAddress,
                password: await generateHash(body.password),
                first_name: body.firstName,
                last_name: body.lastName,
                date_of_birth: body.dateOfBirth
            }
        });

        const roles = await prisma.roles.findMany({
            where: {
                name: { in: body.roles }
            }
        });

        await prisma.user_roles.createMany({
            data: roles.map(role => ({
                role_id: role.role_id,
                user_id: result.user_id
            }))
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
