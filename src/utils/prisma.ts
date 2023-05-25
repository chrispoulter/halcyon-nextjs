import { PrismaClient } from '@prisma/client';
import { config } from './config';

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (config.NODE_ENV === 'development') {
    global.prisma = prisma;
}

export default prisma;
