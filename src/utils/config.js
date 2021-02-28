export const config = {
    ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'dev',
    RELEASE: process.env.REACT_APP_RELEASE || 'dev',
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
    GA_MEASUREMENTID: process.env.REACT_APP_GA_MEASUREMENTID,
    GRAPHQL_URL:
        process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3001/graphql'
};
