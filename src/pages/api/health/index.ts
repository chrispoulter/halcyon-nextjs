import prisma from '@/utils/prisma';
import { NextApiHandler } from 'next';

const healthHandler: NextApiHandler = async (_, res) => {
    await prisma.$queryRaw`SELECT true AS connected`;
    return res.send('Healthy');
};

export default healthHandler;
