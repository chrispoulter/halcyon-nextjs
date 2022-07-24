import * as healthRepository from '../../../_api/data/healthRepository';
import { getHandler } from '../../../_api/utils/handler';
import { config } from '../../../_api/utils/config';

const handler = getHandler();

handler.get(async (_, res) => {
    const database = await healthRepository.getStatus();

    return res.json({
        version: config.VERSION,
        database
    });
});

export default handler;
