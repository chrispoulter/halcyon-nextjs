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

export const formatError = error => {
    if (sentryInitialized) {
        console.log('formatError', error);
        Sentry.captureException(error);
    }

    return error;
};

export const setUser = user => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.setUser(user);
};

export const captureError = error => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.captureException(error);
};
