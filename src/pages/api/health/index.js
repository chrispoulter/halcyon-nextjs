import * as healthRepository from '@/data/healthRepository';
import { getHandler } from '@/utils/handler';
import { config } from '@/utils/config';

const handler = getHandler();

handler.get(async (_, res) => {
    const database = await healthRepository.getStatus();

    return res.json({
        version: config.VERSION,
        database
    });
});

export default handler;
