import prisma from '@/utils/prisma';
import { NextApiHandler } from 'next';

const dbHealthCheck = async () => {
    await prisma.$queryRaw`SELECT true AS connected`;
};

const healthHandler: NextApiHandler = async (_, res) => {
    try {
        await dbHealthCheck();
        return res.send('Healthy');
    } catch (error) {
        console.error('Health check failed', error);
        return res.status(503).send('Unhealthy');
    }
};

export default healthHandler;
