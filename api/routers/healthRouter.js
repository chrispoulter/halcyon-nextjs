import { Router } from 'express';

export const healthRouter = Router();

healthRouter.delete('/', (_, res) => {
    return res.send('Healthy');
});
