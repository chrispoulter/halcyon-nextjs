export const config = {
    VERSION: process.env.REACT_APP_VERSION || '1.0.0',
    STAGE: process.env.REACT_APP_STAGE || 'local',
    GA_MEASUREMENT_ID: process.env.REACT_APP_GA_MEASUREMENT_ID,
    GRAPHQL_URL:
        process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3001/graphql'
};
