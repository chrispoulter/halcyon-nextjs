import 'dotenv/config';

export const config = {
    ENVIRONMENT: process.env.ENVIRONMENT || 'local',
    RELEASE: process.env.RELEASE || 'local',
    SNS_EVENTSARN: process.env.SNS_EVENTSARN,
    SNS_ENDPOINT: process.env.SNS_ENDPOINT,
    CLIENT_URL: process.env.CLIENT_URL,
    FAUNADB_SECRET: process.env.FAUNADB_SECRET,
    JWT_SECURITYKEY: process.env.JWT_SECURITYKEY || 'change-me-1234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    JWT_EXPIRESIN: parseInt(process.env.JWT_EXPIRESIN || '3600'),
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_APIKEY: process.env.MAILGUN_APIKEY,
    MAILGUN_NOREPLY: process.env.MAILGUN_NOREPLY || 'noreply@chrispoulter.com',
    SEED_EMAILADDRESS: process.env.SEED_EMAILADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD,
    SENTRY_DSN: process.env.SENTRY_DSN
};

if (config.ENVIRONMENT === 'local') {
    config.SNS_ENDPOINT = 'http://127.0.0.1:4002';
    config.CLIENT_URL = 'http://localhost:3000';
}
