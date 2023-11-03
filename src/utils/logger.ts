import pino from 'pino';
import 'pino-pretty';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
        level: label => ({ level: label })
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    browser: {
        asObject: true
    },
    transport: {
        target: 'pino-pretty'
    }
});
