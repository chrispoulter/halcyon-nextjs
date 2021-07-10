export const config = {
    STAGE: process.env.REACT_APP_STAGE || 'local',
    RELEASE: process.env.REACT_APP_RELEASE || 'local',
    GA_MEASUREMENTID: process.env.REACT_APP_GA_MEASUREMENTID,
    GRAPHQL_URL:
        process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3001/graphql'
};
