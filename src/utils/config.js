require('dotenv/config');

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECURITYKEY: process.env.JWT_SECURITYKEY,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_NOREPLY: process.env.SMTP_NOREPLY,
    SEED_EMAILADDRESS: process.env.SEED_EMAILADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE
};
