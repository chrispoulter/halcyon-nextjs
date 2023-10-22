import { PrismaClient } from '@prisma/client';
import { config } from './config';

const getExtendedClient = () => {
    return new PrismaClient({
        log: ['query']
    })
        .$extends({
            query: {
                $allModels: {
                    create({ args, query }) {
                        args.data.version = crypto.randomUUID();
                        return query(args);
                    },
                    update({ args, query }) {
                        args.data.version = crypto.randomUUID();
                        return query(args);
                    },
                    upsert({ args, query }) {
                        args.create.version = args.update.version =
                            crypto.randomUUID();
                        return query(args);
                    }
                }
            }
        })
        .$extends({
            query: {
                users: {
                    create({ args, query }) {
                        args.data.search = `${args.data.emailAddress} ${args.data.firstName} ${args.data.lastName}`;
                        return query(args);
                    },
                    update({ args, query }) {
                        args.data.search = `${args.data.emailAddress} ${args.data.firstName} ${args.data.lastName}`;
                        return query(args);
                    },
                    upsert({ args, query }) {
                        args.create.search =
                            args.update.search = `${args.create.emailAddress} ${args.create.firstName} ${args.create.lastName}`;
                        return query(args);
                    }
                }
            }
        });
};

type ExtendedPrismaClient = ReturnType<typeof getExtendedClient>;

const globalForPrisma = global as unknown as { prisma: ExtendedPrismaClient };

let prisma = globalForPrisma.prisma;

if (!prisma) {
    prisma = getExtendedClient();
}

if (config.NODE_ENV === 'development') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
