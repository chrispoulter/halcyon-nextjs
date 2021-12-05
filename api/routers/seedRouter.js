import { Router } from 'express';

export const seedRouter = Router();

seedRouter.get('/', (_, res) => {
    return res.json({
        data: {
            id: 1
        },
        code: 'USER_CREATED',
        message: 'User successfully created.'
    });
});
