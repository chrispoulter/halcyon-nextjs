import * as Sentry from '@sentry/serverless';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';

var initialized = false;

export const wrapper = handler => {
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

    initialized = true;

    return Sentry.AWSLambda.wrapHandler(handler);
};

export const plugin = () => {
    return {
        requestDidStart({ context, request, operation }) {
            const transactionId =
                request?.http?.headers?.get('x-transaction-id') || uuidv4();

            const kind = operation?.operation;
            const payload = context?.payload;
            const query = request?.query?.replace(/\n/g, '');
            const variables = Object.keys(request?.variables || {});

            console.log('requestDidStart', {
                transactionId,
                kind,
                payload,
                query,
                variables
            });

            return {
                didEncounterErrors({ errors }) {
                    console.log('didEncounterErrors', {
                        transactionId,
                        errors
                    });

                    if (!initialized) {
                        return;
                    }

                    for (const error of errors) {
                        if (
                            error.extensions?.code &&
                            error.extensions?.code !== 'INTERNAL_SERVER_ERROR'
                        ) {
                            continue;
                        }

                        if (initialized) {
                            Sentry.withScope(scope => {
                                scope.setTag('kind', kind);
                                scope.setExtra('query', query);
                                scope.setExtra('variables', variables);

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
                        }
                    }
                },

                didResolveOperation({ metrics, operationName }) {
                    console.log('didResolveOperation', {
                        transactionId,
                        metrics,
                        operationName
                    });
                },

                executionDidStart({ metrics }) {
                    console.log('executionDidStart', {
                        transactionId,
                        metrics
                    });
                },

                parsingDidStart({ metrics }) {
                    console.log('parsingDidStart', { transactionId, metrics });
                },

                responseForOperation({ metrics, operationName }) {
                    console.log('responseForOperation', {
                        transactionId,
                        metrics,
                        operationName
                    });
                    return null;
                },

                validationDidStart({ metrics }) {
                    console.log('validationDidStart', {
                        transactionId,
                        metrics
                    });
                },

                willSendResponse({ metrics }) {
                    console.log('willSendResponse', { transactionId, metrics });
                }
            };
        }
    };
};

export const captureError = (message, data) => {
    console.log(message, data);

    if (!initialized) {
        return;
    }

    Sentry.withScope(scope => {
        scope.setTag('type', data.type);
        scope.setExtra('data', data.data);

        if (data.transactionId) {
            scope.setTransactionName(data.transactionId);
        }

        Sentry.captureException(data.error);
    });
};

export const captureMessage = console.log;
