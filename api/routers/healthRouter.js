import { Router } from 'express';
import { healthRepository } from '../data';
import { asyncMiddleware } from '../middleware';
import { config } from '../utils/config';

export const healthRouter = Router();

healthRouter.get(
    '/',
    asyncMiddleware(async (_, res) => {
        const database = await healthRepository.getStatus();

        return res.json({
            version: config.VERSION,
            database
        });
    })
);
