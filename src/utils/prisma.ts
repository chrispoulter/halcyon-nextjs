import { PrismaClient } from '@prisma/client';
import { config } from './config';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma = globalForPrisma.prisma;

if (!prisma) {
    prisma = new PrismaClient({
        log: ['query']
    });
}

if (config.NODE_ENV === 'development') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
