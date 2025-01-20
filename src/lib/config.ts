export const config = {
    VERSION: process.env.npm_package_version!,
    API_URL: process.env.API_URL!,
    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY!,
    JWT_ISSUER: process.env.JWT_ISSUER!,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE!,
    SESSION_SECRET: process.env.SESSION_SECRET!,
};
