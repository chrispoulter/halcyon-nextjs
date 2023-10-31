import { NextApiHandler } from 'next';
import { config } from '@/utils/config';

const apiHealthCheck = async () => {
    const response = await fetch(`${config.PROXY_API_URL}/health`, {
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
        console.error('Health check failed', error);
        return res.status(503).send('Unhealthy');
    }
};

export default healthHandler;
