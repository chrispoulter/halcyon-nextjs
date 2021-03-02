import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { config } from './config';

let initialized = false;

export const initialize = () => {
    if (!config.SENTRY_DSN) {
        return;
    }

    Sentry.init({
        dsn: config.SENTRY_DSN,
        release: `halcyon@${config.RELEASE}`,
        environment: config.ENVIRONMENT,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0
    });

    Sentry.setTag('project', 'frontend');

    initialized = true;
};

export const setUser = user => {
    if (!initialized) {
        return;
    }

    Sentry.setUser(user);
};

export const setContext = context => {
    if (!initialized) {
        return;
    }

    Sentry.setTags(context);
};

export const captureGraphQLError = error => {
    if (!initialized) {
        return;
    }

    if (error.graphQLErrors) {
        const ctx = error.operation?.getContext();
        const transactionId = ctx.headers?.['x-transaction-id'];

        for (const graphQLError of error.graphQLErrors) {
            if (
                graphQLError.extensions?.code &&
                graphQLError.extensions?.code !== 'INTERNAL_SERVER_ERROR'
            ) {
                continue;
            }

            Sentry.captureMessage(graphQLError.message, scope => {
                scope.setExtra('path', graphQLError.path);
                scope.setExtra('locations', graphQLError.locations);
                scope.setExtra('code', graphQLError.extensions?.code);
                scope.setExtra(
                    'stacktrace',
                    graphQLError.extensions?.exception?.stacktrace
                );

                if (transactionId) {
                    scope.setTransactionName(transactionId);
                }
            });
        }
    } else if (error.networkError) {
        Sentry.captureException(error.networkError);
    }
};
