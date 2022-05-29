export const config = {
    VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    STAGE: process.env.NEXT_PUBLIC_STAGE || 'local',
    API_URL: process.env.NEXT_PUBLIC_API_URL || '/api'
};
