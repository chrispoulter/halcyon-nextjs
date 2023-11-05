import pino from 'pino';
import { config } from './config';

import 'pino-pretty';

export const logger = pino({
    level: config.LOG_LEVEL,
    formatters: {
        level: label => ({ level: label })
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        target: 'pino-pretty'
    }
});
