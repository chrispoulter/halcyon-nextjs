import { Router } from 'express';
import { asyncMiddleware } from '../middleware';

export const seedRouter = Router();

seedRouter.get(
    '/',
    asyncMiddleware((_, res) => {
        return res.json({
            data: {
                id: 1
            },
            code: 'USER_CREATED',
            message: 'User successfully created.'
        });
    })
);
