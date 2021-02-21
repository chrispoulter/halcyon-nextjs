import * as Sentry from '@sentry/serverless';
import { config } from './config';

var sentryInitialized = false;

export const initializeLogger = handler => {
    if (!config.SENTRY_DSN) {
        return handler;
    }

    Sentry.AWSLambda.init({
        dsn: config.SENTRY_DSN,
        release: `halcyon@${config.RELEASE}`,
        environment: config.ENVIRONMENT,
        tracesSampleRate: 1.0
    });

    Sentry.setTag('project', 'api');

    sentryInitialized = true;

    return Sentry.AWSLambda.wrapHandler(handler);
};

export const loggerPlugin = {
    requestDidStart() {
        return {
            didEncounterErrors(ctx) {
                if (!sentryInitialized) {
                    return;
                }

                const payload = ctx.context?.payload;
                const transactionId = ctx.request?.http?.headers?.get(
                    'x-transaction-id'
                );

                ctx.errors?.forEach(error => {
                    Sentry.withScope(scope => {
                        scope.setTag('kind', ctx.operation?.operation);
                        scope.setExtra('query', ctx.request?.query);
                        scope.setExtra('variables', ctx.request?.variables);

                        if (payload) {
                            scope.setUser(payload);
                        }

                        if (error.path) {
                            scope.addBreadcrumb({
                                category: 'query-path',
                                message: error.path.join(' > '),
                                level: Sentry.Severity.Debug
                            });
                        }

                        if (transactionId) {
                            scope.setTransactionName(transactionId);
                        }

                        Sentry.captureException(error);
                    });
                });
            }
        };
    }
};

export const captureError = error => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.captureException(error);
};
