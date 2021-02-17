import Sentry from '@sentry/serverless';
import { config } from './config';

var sentryInitialized = false;

export const initializeLogger = () => {
    if (!config.SENTRY_DSN) {
        return;
    }

    Sentry.AWSLambda.init({
        dsn: config.SENTRY_DNS,
        release: `halcyon@${config.RELEASE}`,
        environment: config.ENVIRONMENT,
        tracesSampleRate: 1.0
    });

    sentryInitialized = true;
};

export const wrapHandler = handler =>
    sentryInitialized ? Sentry.AWSLambda.wrapHandler(handler) : handler;

export const setUser = user => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.setUser(user);
};

export const captureException = error => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.captureException(error);
};
