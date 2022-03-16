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
import { shutdown } from './utils/database';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('tiny', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', '..', 'build')));

app.use('/health', healthRouter);
app.use('/api/account', accountRouter);
app.use('/api/manage', manageRouter);
app.use('/api/token', tokenRouter);
app.use('/api/user', userRouter);

app.get('*', (_, res) =>
    res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'))
);

app.use(errorMiddleware);

const server = app.listen(port, () =>
    logger.info(`App listening on port ${port}`)
);

const killProcess = signal => {
    logger.info(`Received signal to terminate ${signal}`);
    server.close(() => {
        logger.debug('Http server closed');
        shutdown().then(() => process.exit(0));
    });
};

[
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException',
    'SIGTERM'
].forEach(eventType =>
    process.on(eventType, killProcess.bind(null, eventType))
);
