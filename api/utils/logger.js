import winston from 'winston';

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
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
                    Object.keys(metadata).length
                        ? JSON.stringify(metadata)
                        : ''
                }`
        )
    ),
    transports: [new winston.transports.Console()]
});

logger.stream = {
    write: message =>
        logger.http(message.substring(0, message.lastIndexOf('\n')))
};
