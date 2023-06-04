import { PrismaClient, Users } from '@prisma/client';
import { config } from './config';

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (config.NODE_ENV === 'development') {
    global.prisma = prisma;
}

const computeUserColumns = (user: Users) => {
    user.search =
        `${user.emailAddress} ${user.firstName} ${user.lastName}`.toLocaleLowerCase();
};

prisma.$use(async (params, next) => {
    if (
        params.model == 'Users' &&
        ['create', 'update'].includes(params.action)
    ) {
        computeUserColumns(params.args.data);
    }

    if (params.model == 'Users' && params.action === 'upsert') {
        computeUserColumns(params.args.create);
        computeUserColumns(params.args.update);
    }

    return next(params);
});

export default prisma;
