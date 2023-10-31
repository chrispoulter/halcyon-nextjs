import { NextApiHandler } from 'next';
import { config } from '@/utils/config';

const healthHandler: NextApiHandler = async (_, res) => {
    try {
        const response = await fetch(`${config.API_URL}/health`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}.`);
        }

        return res.send('Healthy');
    } catch (error) {
        console.error('api health', error);
        return res.status(500).send('Unhealthy');
    }
};

export default healthHandler;
