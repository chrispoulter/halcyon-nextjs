import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { config } from './config';

var sentryInitialized = false;

export const initializeLogger = () => {
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

    sentryInitialized = true;
};

export const setTag = (key, value) => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.setTag(key, value);
};

export const setUser = user => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.setUser(user);
};

export const captureGraphQLError = error => {
    if (!sentryInitialized) {
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
                scope.setExtra('stacktrace', graphQLError.extensions?.exception?.stacktrace);

                if (transactionId) {
                    scope.setTransactionName(transactionId);
                }
            });
        }
    } else if (error.networkError) {
        Sentry.captureException(error.networkError);
    }
};
