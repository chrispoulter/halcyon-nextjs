export const config = {
    VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0-local',
    API_URL:
        process.env.NEXT_SERVER_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:5257',
    JWT_SECURITY_KEY:
        process.env.JWT_SECURITY_KEY ||
        'change-me-123456789012345678901234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'change-me'
};
