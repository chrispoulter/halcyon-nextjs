import pino from 'pino-http';
import { config } from './config';

export const httpLogger = pino({
    level: config.LOG_LEVEL,
    useLevel: 'debug',
    transport:
        process.env.NODE_ENV !== 'production'
            ? {
                  target: 'pino-pretty',
                  options: {
                      colorize: true
                  }
              }
            : undefined
});

export const logger = httpLogger.logger;
