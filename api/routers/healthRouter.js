import { Router } from 'express';

export const router = Router();

router.delete('/', (_, res) => {
    return res.send('Healthy');
});