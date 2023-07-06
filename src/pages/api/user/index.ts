import crypto from 'crypto';
import {
    createUserSchema,
    SearchUsersResponse,
    searchUsersSchema,
    UserSort
} from '@/models/user.types';
import { Prisma } from '@prisma/client';
import prisma from '@/utils/prisma';
import { handler, Handler, UpdatedResponse } from '@/utils/handler';
import { generateHash } from '@/utils/hash';
import { isUserAdministrator, Role } from '@/utils/auth';

const searchUsersHandler: Handler<SearchUsersResponse> = async (req, res) => {
    const query = await searchUsersSchema.validate(req.query);

    let where: Prisma.UsersWhereInput | undefined;

    if (query.search) {
        where = {
            search: {
                contains: query.search,
                mode: Prisma.QueryMode.insensitive
            }
        };
    }

    const count = await prisma.users.count({ where });

    let orderBy: Prisma.Enumerable<Prisma.UsersOrderByWithRelationInput>;

    switch (query.sort) {
        case UserSort.EMAIL_ADDRESS_ASC:
            orderBy = {
                emailAddress: Prisma.SortOrder.asc
            };
            break;
        case UserSort.EMAIL_ADDRESS_DESC:
            orderBy = {
                emailAddress: Prisma.SortOrder.desc
            };
            break;
        case UserSort.NAME_DESC:
            orderBy = [
                { firstName: Prisma.SortOrder.desc },
                { lastName: Prisma.SortOrder.desc }
            ];
            break;
        default:
            orderBy = [
                { firstName: Prisma.SortOrder.asc },
                { lastName: Prisma.SortOrder.asc }
            ];
            break;
    }

    const skip = (query.page - 1) * query.size;

    const users = await prisma.users.findMany({
        where,
        orderBy,
        skip,
        take: query.size
    });

    const pageCount = Math.floor((count + query.size - 1) / query.size);
    const hasNextPage = query.page < pageCount;
    const hasPreviousPage = query.page > 1;

    return res.json({
        data: {
            items: users.map(user => ({
                id: user.id,
                emailAddress: user.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth,
                isLockedOut: user.isLockedOut,
                roles: user.roles.map(r => r as Role)
            })),
            hasNextPage,
            hasPreviousPage
        }
    });
};

const createUserHandler: Handler<UpdatedResponse> = async (req, res) => {
    const body = await createUserSchema.validate(req.body);

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
            roles: body.roles,
            version: crypto.randomUUID()
        }
    });

    return res.json({
        code: 'USER_CREATED',
        message: 'User successfully created.',
        data: {
            id: result.id
        }
    });
};

export default handler(
    {
        get: searchUsersHandler,
        post: createUserHandler
    },
    { auth: isUserAdministrator }
);
