export const config = {
    VERSION: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || '1.0.0',
    STAGE: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || 'local',
    API_URL: process.env.NEXT_PUBLIC_API_URL || '/api'
};
