import { PrismaClient } from '@prisma/client';
import { config } from './config';
import { logger } from './logger';

const globalForPrisma = global as unknown as {
    prisma: PrismaClient<{
        log: [
            {
                emit: 'event';
                level: 'query';
            }
        ];
    }>;
};

let prisma = globalForPrisma.prisma;

if (!prisma) {
    prisma = new PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query'
            }
        ]
    });

    prisma.$on('query', ({ query, duration }) => {
        logger.info('Executed query (%dms) %s', duration, query);
    });
}

if (config.NODE_ENV === 'development') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
