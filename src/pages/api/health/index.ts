import { NextApiHandler } from 'next';

const healthHandler: NextApiHandler = async (_, res) => {
    return res.send('Healthy');
};

export default healthHandler;
