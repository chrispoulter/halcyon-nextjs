import 'dotenv/config';

export const config = {
    VERSION: process.env.VERSION || '1.0.0',
    STAGE: process.env.STAGE || 'local',

    AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID || '123456789012',
    AWS_REGION: process.env.AWS_REGION || 'eu-west-1',

    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY || 'change-me-1234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '3600'),

    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    MAILGUN_NO_REPLY:
        process.env.MAILGUN_NO_REPLY || 'noreply@chrispoulter.com',

    SEED_EMAIL_ADDRESS: process.env.SEED_EMAIL_ADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD,

    CLIENT_URL: process.env.CLIENT_URL
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
