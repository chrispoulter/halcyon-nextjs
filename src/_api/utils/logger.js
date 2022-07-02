import winston from 'winston';
import { config } from './config';

export const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.metadata({
            fillExcept: ['message', 'level', 'timestamp', 'label']
        }),
        winston.format.splat(),
        winston.format.printf(
            ({ timestamp, level, message, metadata }) =>
                `${timestamp} ${level}: ${message} ${
                    Object.keys(metadata).length ? JSON.stringify(metadata) : ''
                }`
        )
    ),
    transports: [new winston.transports.Console()]
});
