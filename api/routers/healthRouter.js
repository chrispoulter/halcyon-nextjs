import { Router } from 'express';
import { healthRepository } from '../data';
import { asyncMiddleware } from '../middleware';
import { config } from '../utils/config';

export const healthRouter = Router();

healthRouter.get(
    '/',
    asyncMiddleware(async (_, res) => {
        const status = await healthRepository.getStatus();

        return res.json({
            data: {
                version: config.VERSION,
                stage: config.STAGE,
                status
            }
        });
    })
);
