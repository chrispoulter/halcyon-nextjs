export const config = {
    VERSION: process.env.NEXT_PUBLIC_VERSION!,
    API_URL:
        process.env.NEXT_SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL!,
    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY!,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE
};
