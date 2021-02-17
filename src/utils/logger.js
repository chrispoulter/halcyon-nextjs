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

    Sentry.setTag('project', 'frontend')

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

export const captureException = error => {
    if (!sentryInitialized) {
        return;
    }

    Sentry.captureException(error);
};
