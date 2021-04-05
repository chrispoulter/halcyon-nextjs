import 'dotenv/config';

const accountId = process.env.ACCOUNTID || '123456789012';
const stage = process.env.STAGE || 'local';
const region = process.env.REGION || 'eu-west-1';
const release = process.env.RELEASE || 'local';

export const config = {
    ACCOUNTID: accountId,
    STAGE: stage,
    REGION: region,
    RELEASE: release,

    JWT_SECURITYKEY: process.env.JWT_SECURITYKEY || 'change-me-1234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    JWT_EXPIRESIN: parseInt(process.env.JWT_EXPIRESIN || '3600'),

    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_APIKEY: process.env.MAILGUN_APIKEY,
    MAILGUN_NOREPLY: process.env.MAILGUN_NOREPLY || 'noreply@chrispoulter.com',

    SEED_EMAILADDRESS: process.env.SEED_EMAILADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD,

    SENTRY_DSN: process.env.SENTRY_DSN,

    CLIENT_URL:
        stage === 'local' ? 'http://localhost:3000' : process.env.CLIENT_URL
};
