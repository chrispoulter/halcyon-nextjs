import express from 'express';
import morgan from 'morgan';
import { errorMiddleware } from './middleware';
import {
    accountRouter,
    healthRouter,
    manageRouter,
    tokenRouter,
    userRouter
} from './routers';
import { logger } from './utils/logger';

const app = express();

app.use(morgan('tiny', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);

app.use('/api/account', accountRouter);
app.use('/api/manage', manageRouter);
app.use('/api/token', tokenRouter);
app.use('/api/user', userRouter);

app.use(errorMiddleware);

const port = 3001;

app.listen(port, () => logger.info(`App listening on port ${port}`));
