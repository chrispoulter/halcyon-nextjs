export const config = {
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0-local',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    API_URL: `${process.env.NEXTAUTH_URL || ''}/api`,

    DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgres://postgres:password@localhost/halcyon',

    EMAIL_SMTP_SERVER: process.env.EMAIL_SMTP_SERVER || 'localhost',
    EMAIL_SMTP_PORT: parseInt(process.env.EMAIL_SMTP_PORT || '1025'),
    EMAIL_SMTP_USERNAME: process.env.EMAIL_SMTP_USERNAME,
    EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
    EMAIL_NO_REPLY_ADDRESS:
        process.env.EMAIL_NO_REPLY_ADDRESS || 'noreply@example.com',

    SEED_EMAIL_ADDRESS:
        process.env.SEED_EMAIL_ADDRESS || 'system.administrator@example.com',
    SEED_PASSWORD: process.env.SEED_PASSWORD || 'change-me-1234567890',

    NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ||
        'YenEZqADi2YnfVCNWMFkcUpmr55ESFepmHgH3NSmPoBeSqf9Hs3Ui8vb6xdkCY9PNewqNxVQdjkqhCGaWeyri48FyDPU9HfKFjbHcfbyq4Fuqmk2suehduYJYzuPoSD8',
    NEXTAUTH_SESSION_MAXAGE: parseInt(
        process.env.NEXTAUTH_SESSION_MAXAGE || '3600'
    )
};
