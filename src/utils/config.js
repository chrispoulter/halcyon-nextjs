export const config = {
    VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',

    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

    DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgres://postgres:example@localhost/halcyon',

    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY || 'change-me-1234567890',
    JWT_ISSUER: process.env.JWT_ISSUER || 'HalcyonApi',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'HalcyonClient',
    JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '3600'),

    EMAIL_SMTP_SERVER: process.env.EMAIL_SMTP_SERVER || 'localhost',
    EMAIL_SMTP_PORT: parseInt(process.env.EMAIL_SMTP_PORT || '1025'),
    EMAIL_SMTP_USERNAME: process.env.EMAIL_SMTP_USERNAME,
    EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
    EMAIL_NO_REPLY_ADDRESS:
        process.env.EMAIL_NO_REPLY_ADDRESS || 'noreply@chrispoulter.com',

    SEED_EMAIL_ADDRESS: process.env.SEED_EMAIL_ADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD
};
