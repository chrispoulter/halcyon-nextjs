import 'dotenv/config';

export const config = {
    VERSION: process.env.VERSION || '1.0.0',
    STAGE: process.env.STAGE || 'local',

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
    SEED_PASSWORD: process.env.SEED_PASSWORD
};

switch (config.STAGE) {
    case 'local':
        config.AWS_DYNAMODB_ENDPOINT = 'http://localhost:8000';
        config.AWS_SNS_ENDPOINT = 'http://127.0.0.1:4002';
        config.CLIENT_URL = 'http://localhost:3000';
        break;

    default:
        break;
}
