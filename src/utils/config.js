require('dotenv/config');

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || '',
    JWT_SECURITYKEY: process.env.JWT_SECURITYKEY || '',
    JWT_ISSUER: process.env.JWT_ISSUER || '',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || '',
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || '',
    MAILGUN_PASSWORD: process.env.MAILGUN_PASSWORD || '',
    MAILGUN_NOREPLY: process.env.MAILGUN_NOREPLY || '',
    SEED_EMAILADDRESS: process.env.SEED_EMAILADDRESS || '',
    SEED_PASSWORD: process.env.SEED_PASSWORD || ''
};
