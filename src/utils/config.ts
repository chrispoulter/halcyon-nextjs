export const config = {
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.NEXT_PUBLIC_GITVERSION_SEMVER || '1.0.0',

    API_URL:
        process.env.NEXT_PUBLIC_API_URL ||
        `${process.env.NEXTAUTH_URL || ''}/api`,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'change-me-1234567890',
    NEXTAUTH_SESSION_MAXAGE: parseInt(
        process.env.NEXTAUTH_SESSION_MAXAGE || '3600'
    )
};
