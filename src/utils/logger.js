const Sentry = require('@sentry/node');
const config = require('./config');

module.exports.initialize = () =>
    Sentry.init({ dsn: config.SENTRY_DSN, normalizeDepth: 0 });

module.exports.formatError = error => {
    Sentry.withScope(scope => {
        scope.setExtras(error);
        Sentry.captureException(error.originalError);
    });

    return error;
};

module.exports.log = (...args) => console.log(...args);

module.exports.error = (message, error) => {
    console.error(message, error);

    Sentry.withScope(scope => {
        scope.setExtras({ message });
        Sentry.captureException(error);
    });
};
