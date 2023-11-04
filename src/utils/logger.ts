import pino from 'pino';
import pinoHttp from 'pino-http';
import { config } from './config';

import 'pino-pretty';

export const httpLogger = pinoHttp({
    level: config.LOG_LEVEL,
    formatters: {
        level: label => ({ level: label })
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        target: 'pino-pretty'
    }
});

export const logger = httpLogger.logger;
