import { NextApiHandler } from 'next';
import prisma from '@/utils/prisma';
import { logger } from '@/utils/logger';

const dbHealthCheck = async () => {
    await prisma.$queryRaw`SELECT true AS connected`;
};

const healthHandler: NextApiHandler = async (_, res) => {
    try {
        await dbHealthCheck();
        return res.send('Healthy');
    } catch (error) {
        logger.error(error, 'Health check failed');
        return res.status(503).send('Unhealthy');
    }
};

export default healthHandler;
