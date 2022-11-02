import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query'
            }
        ]
    });

    prisma.$on('query', ({ query, params, duration }) =>
        logger.debug({ query, params, duration }, 'db query executed')
    );
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: [
                {
                    emit: 'event',
                    level: 'query'
                }
            ]
        });

        global.prisma.$on('query', ({ query, params, duration }) =>
            logger.debug({ query, params, duration }, 'db query executed')
        );
    }

    prisma = global.prisma;
}

export default prisma;
