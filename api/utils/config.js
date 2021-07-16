import 'dotenv/config';

const VERSION = process.env.VERSION || '1.0.0';
const STAGE = process.env.STAGE || 'local';

export const config = {
    VERSION,
    STAGE,

    AWS_ACCOUNTID: process.env.AWS_ACCOUNTID || '123456789012',
    AWS_REGION: process.env.AWS_REGION || 'eu-west-1',

    JWT_SECURITYKEY: process.env.JWT_SECURITYKEY || 'change-me-1234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    JWT_EXPIRESIN: parseInt(process.env.JWT_EXPIRESIN || '3600'),

    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_APIKEY: process.env.MAILGUN_APIKEY,
    MAILGUN_NOREPLY: process.env.MAILGUN_NOREPLY || 'noreply@chrispoulter.com',

    SEED_EMAILADDRESS: process.env.SEED_EMAILADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD,

    DYNAMODB_ENDPOINT: STAGE === 'local' ? 'http://localhost:8000' : undefined,

    SNS_ENDPOINT: STAGE === 'local' ? 'http://127.0.0.1:4002' : undefined,

    CLIENT_URL:
        STAGE === 'local' ? 'http://localhost:3000' : process.env.CLIENT_URL
};
