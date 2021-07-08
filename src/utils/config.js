export const config = {
    STAGE: process.env.REACT_APP_STAGE || 'local',
    RELEASE: process.env.REACT_APP_RELEASE || 'local',
    GRAPHQL_URL:
        process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3001/graphql',
    GA_MEASUREMENTID: process.env.REACT_APP_GA_MEASUREMENTID
};
