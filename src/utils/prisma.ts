import { Prisma, PrismaClient, Users } from '@prisma/client';
import { config } from './config';

declare global {
    var prisma: PrismaClient | undefined;
}

const computeUserData = (user: Users) => {
    user.search = `${user.emailAddress} ${user.firstName} ${user.lastName}`;
};

const userMiddleware: Prisma.Middleware = async (params, next) => {
    if (
        params.model == 'Users' &&
        ['create', 'update'].includes(params.action)
    ) {
        computeUserData(params.args.data);
    }

    if (params.model == 'Users' && params.action === 'upsert') {
        computeUserData(params.args.create);
        computeUserData(params.args.update);
    }

    return next(params);
};

var prisma = global.prisma;

if (!prisma) {
    prisma = new PrismaClient();
    prisma.$use(userMiddleware);
}

if (config.NODE_ENV === 'development') {
    global.prisma = prisma;
}

export default prisma!;
