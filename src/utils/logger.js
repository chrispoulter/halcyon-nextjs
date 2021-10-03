import { config } from '../utils/config';

let initialized = false;

export const initialize = () => {
    if (!config.GA_MEASUREMENT_ID) {
        return;
    }

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.GA_MEASUREMENT_ID}`;
    script.id = 'googleAnalytics';
    script.crossorigin = 'anonymous';
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', config.GA_MEASUREMENT_ID);

    initialized = true;
};

export const setUser = user => {
    if (!initialized) {
        return;
    }

    window.gtag('set', {
        user_id: user?.sub,
        role: user?.role
    });
};

export const setContext = context => {
    if (!initialized) {
        return;
    }

    window.gtag('set', context);
};

export const trackEvent = (event, params) => {
    if (!initialized) {
        return;
    }

    window.gtag('event', event, params);
};

export const captureError = (error, fatal, data) => {
    if (!initialized) {
        return;
    }

    window.gtag('event', 'exception', {
        description: error.message,
        fatal: fatal || false,
        error,
        data
    });
};

export const captureGraphQLError = error => {
    if (!initialized) {
        return;
    }

    if (error.graphQLErrors) {
        for (const graphQLError of error.graphQLErrors) {
            if (
                graphQLError.extensions?.code &&
                graphQLError.extensions?.code !== 'INTERNAL_SERVER_ERROR'
            ) {
                continue;
            }

            window.gtag('event', 'exception', {
                description: graphQLError.message,
                fatal: false,
                path: graphQLError.path,
                locations: graphQLError.locations,
                code: graphQLError.extensions?.code,
                stacktrace: graphQLError.extensions?.exception?.stacktrace
            });
        }
    } else if (error.networkError) {
        window.gtag('event', 'exception', {
            description: error.networkError,
            fatal: false
        });
    }
};
