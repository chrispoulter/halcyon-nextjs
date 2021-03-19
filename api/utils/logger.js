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
        requestDidStart({ context, request }) {
            const transactionId =
                request?.http?.headers?.get('x-transaction-id') || uuidv4();

            const payload = context?.payload;
            const query = request?.query?.replace(/\n/g, '');
            const variables = Object.keys(request?.variables || {});

            console.log('GraphQL', {
                transactionId,
                payload,
                query,
                variables
            });

            return {
                didEncounterErrors({ errors }) {
                    for (const error of errors) {
                        if (
                            error.extensions?.code &&
                            error.extensions?.code !== 'INTERNAL_SERVER_ERROR'
                        ) {
                            continue;
                        }

                        console.error('GraphQL', {
                            transactionId,
                            payload,
                            query,
                            variables,
                            error
                        });

                        if (initialized) {
                            Sentry.withScope(scope => {
                                scope.setExtras({ query, variables });

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
                }
            };
        }
    };
};

export const captureError = (message, data) => {
    console.error(message, data);

    if (!initialized) {
        return;
    }

    const { transactionId, error, ...extras } = data;

    Sentry.withScope(scope => {
        scope.setExtras(extras);

        if (transactionId) {
            scope.setTransactionName(transactionId);
        }

        Sentry.captureException(error);
    });
};

export const captureMessage = (message, data) => {
    console.log(message, data);
};
