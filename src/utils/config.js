require('dotenv/config');

module.exports = {
    FAUNADB_SECRET: process.env.FAUNADB_SECRET,
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
