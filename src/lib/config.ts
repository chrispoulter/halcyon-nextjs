export const config = {
    VERSION: process.env.VERSION!,
    API_URL: process.env.API_URL!,
    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY!,
    JWT_ISSUER: process.env.JWT_ISSUER!,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE!,
    SESSION_SECRET: process.env.SESSION_SECRET!,
    SESSION_EXPIRES_IN: parseInt(process.env.SESSION_EXPIRES_IN!, 10),
};
