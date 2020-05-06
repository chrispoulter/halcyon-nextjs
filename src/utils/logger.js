const Sentry = require('@sentry/node');
const config = require('./config');

module.exports.captureException = error => {
    console.error(error);
    Sentry.captureException(error);
};

module.exports.loggerPlugin = {
    serverWillStart() {
        Sentry.init({
            dsn: config.SENTRY_DSN,
            environment: config.SENTRY_ENVIRONMENT
        });
    },
    requestDidStart() {
        return {
            didEncounterErrors(requestContext) {
                Sentry.withScope(async scope => {
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

                    await Sentry.flush(2000);
                });
            }
        };
    }
};
