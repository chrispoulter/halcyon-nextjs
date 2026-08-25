import { logs, SeverityNumber } from '@opentelemetry/api-logs';

const otelLogger = logs.getLogger('halcyon-nextjs');

type LogAttributes = Record<string, string | number | boolean | undefined>;

function emit(
    severityNumber: SeverityNumber,
    severityText: string,
    message: string,
    error?: unknown,
    attributes?: LogAttributes
) {
    otelLogger.emit({
        severityNumber,
        severityText,
        body: message,
        attributes: {
            ...attributes,
            ...(error instanceof Error && {
                'error.type': error.name,
                'error.message': error.message,
            }),
        },
    });
}

export const logger = {
    info(message: string, attributes?: LogAttributes) {
        console.log(message);
        emit(SeverityNumber.INFO, 'INFO', message, undefined, attributes);
    },
    warn(message: string, attributes?: LogAttributes) {
        console.warn(message);
        emit(SeverityNumber.WARN, 'WARN', message, undefined, attributes);
    },
    error(message: string, error?: unknown, attributes?: LogAttributes) {
        console.error(message, error);
        emit(SeverityNumber.ERROR, 'ERROR', message, error, attributes);
    },
};
