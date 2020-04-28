const Sentry = require('@sentry/node');
const config = require('./config');

module.exports.error = error => {
    console.error(error);
    Sentry.captureException(error);
};

module.exports.plugin = {
    serverWillStart() {
        Sentry.init({
            dsn: config.SENTRY_DSN,
            environment: config.SENTRY_ENVIRONMENT,
            release: config.SENTRY_RELEASE
        });
    },
    requestDidStart() {
        return {
            didEncounterErrors(requestContext) {
                Sentry.withScope(scope => {
                    scope.setUser(requestContext.context.payload);

                    scope.setExtras({
                        operation: requestContext.operation,
                        operationName: requestContext.operationName,
                        request: requestContext.request,
                        response: requestContext.response,
                        source: requestContext.source
                    });

                    for (const error of requestContext.errors) {
                        Sentry.captureException(error);
                    }
                });
            }
        };
    }
};
