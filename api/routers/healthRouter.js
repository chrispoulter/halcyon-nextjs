import { Router } from 'express';
import { asyncMiddleware } from '../middleware';

export const healthRouter = Router();

healthRouter.get(
    '/',
    asyncMiddleware((_, res) => {
        return res.send('Healthy');
    })
);
