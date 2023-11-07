import { NextApiHandler } from 'next';
import { logger } from '@/utils/logger';
import { config } from '@/utils/config';

const apiHealthCheck = async () => {
    const response = await fetch(`${config.EXTERNAL_API_URL}/health`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error(
            `Request failed with status ${response.status} ${response.statusText}`
        );
    }
};

const healthHandler: NextApiHandler = async (_, res) => {
    try {
        await apiHealthCheck();

        return res.send('Healthy');
    } catch (error) {
        logger.error(error, 'Health check failed');
        return res.status(503).send('Unhealthy');
    }
};

export default healthHandler;
