import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_, res) => res.send('Healthy'));
