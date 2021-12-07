import { Router } from 'express';
import { healthRepository } from '../data';
import { asyncMiddleware } from '../middleware';

export const healthRouter = Router();

healthRouter.get(
    '/',
    asyncMiddleware(async (_, res) => {
        const result = await healthRepository.getStatus();

        return res.json({
            data: result
        });
    })
);
