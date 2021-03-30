import 'dotenv/config';

const environment = process.env.ENVIRONMENT || 'local';
const release = process.env.RELEASE || 'local';
const region = process.env.REGION || 'eu-west-1';

export const config = {
    ENVIRONMENT: environment,
    RELEASE: release,
    REGION: region,
    SNS_ENDPOINT: environment === 'local' ? 'http://127.0.0.1:4002' : undefined,
    SNS_EVENTSARN: process.env.SNS_EVENTSARN,
    DYNAMODB_ENDPOINT:
        environment === 'local' ? 'http://localhost:8000' : undefined,
    DYNAMODB_USERS:
        process.env.DYNAMODB_USERS || `halcyon-${environment}-users`,
    DYNAMODB_TEMPLATES:
        process.env.DYNAMODB_TEMPLATES || `halcyon-${environment}-templates`,
    CLIENT_URL: environment === 'local' ? 'http://localhost:3000' : undefined,
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
