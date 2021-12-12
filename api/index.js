import express from 'express';
import path from 'path';
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
const port = process.env.PORT || 3001;

app.use(morgan("tiny", { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/health', healthRouter);
app.use('/api/account', accountRouter);
app.use('/api/manage', manageRouter);
app.use('/api/token', tokenRouter);
app.use('/api/user', userRouter);

app.get('*', (_, res) =>
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
);

app.use(errorMiddleware);

app.listen(port, () => logger.info(`App listening on port ${port}`));
