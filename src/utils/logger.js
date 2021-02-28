import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactGA from 'react-ga';
import { history } from './history';
import { config } from './config';

var sentryInitialized = false;
var gaInitialized = false;

export const initialize = () => {
    initializeSentry();
    initializeGA();
};

const initializeSentry = () => {
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

const initializeGA = () => {
    if (!config.GA_MEASUREMENTID) {
        return;
    }

    ReactGA.initialize(config.GA_MEASUREMENTID);

    history.listen(location => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });

    gaInitialized = true;
};

export const setContext = context => {
    if (sentryInitialized) {
        Sentry.setTags(context);
    }

    if (gaInitialized) {
        ReactGA.set(context);
    }
};

export const setUser = user => {
    if (sentryInitialized) {
        Sentry.setUser(user);
    }

    if (gaInitialized) {
        ReactGA.set({ userId: user?.sub, role: user?.role });
    }
};

export const modalView = name => {
    if (!gaInitialized) {
        return;
    }

    ReactGA.modalview(name);
};

export const trackEvent = event => {
    if (!gaInitialized) {
        return;
    }

    ReactGA.event(event);
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
