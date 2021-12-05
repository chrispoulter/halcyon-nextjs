import 'dotenv/config';

export const config = {
    VERSION: process.env.VERSION || '1.0.0',
    STAGE: process.env.STAGE || 'local',

    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY || 'change-me-1234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '3600'),

    EMAIL_SMTP_SERVER: process.env.EMAIL_SMTP_SERVER || 'smtp.mailgun.org',
    EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT || 587,
    EMAIL_SMTP_USERNAME: process.env.EMAIL_SMTP_USERNAME,
    EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
    EMAIL_NO_REPLY_ADDRESS:
        process.env.EMAIL_NO_REPLY_ADDRESS || 'noreply@chrispoulter.com',

    SEED_EMAIL_ADDRESS: process.env.SEED_EMAIL_ADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD
};
