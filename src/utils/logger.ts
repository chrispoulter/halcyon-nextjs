import pino from 'pino';
import 'pino-pretty';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
        level: label => ({ level: label.toUpperCase() })
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        target: 'pino-pretty'
    }
});
