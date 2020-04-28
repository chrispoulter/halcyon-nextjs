const Sentry = require('@sentry/node');
const config = require('./config');

module.exports.error = error => {
    console.error(error);
    Sentry.captureException(error);
};

module.exports.plugin = {
    serverWillStart() {
        Sentry.init({ dsn: config.SENTRY_DSN });
    },
    requestDidStart() {
        return {
            didEncounterErrors(requestContext) {
                Sentry.withScope(scope => {
                    scope.setUser(requestContext.context.payload);
                    scope.setExtras(requestContext);

                    for (const error of requestContext.errors) {
                        Sentry.captureException(error);
                    }
                });
            }
        };
    }
};
