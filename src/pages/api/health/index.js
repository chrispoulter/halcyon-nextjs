import { getHandler } from '@/utils/handler';
import { config } from '@/utils/config';
import prisma from '@/utils/prisma';

const handler = getHandler();

handler.get(async (_, res) => {
    const result = await prisma.$queryRaw`SELECT true AS connected`;

    return res.json({
        version: config.VERSION,
        database: result[0]
    });
});

export default handler;
