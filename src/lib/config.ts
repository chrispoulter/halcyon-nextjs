export const config = {
    VERSION: String(process.env.npm_package_version),
    DATABASE_URL_UNPOOLED: String(process.env.DATABASE_URL_UNPOOLED),
    EMAIL_SMTP_SERVER: String(process.env.EMAIL_SMTP_SERVER),
    EMAIL_SMTP_PORT: Number(process.env.EMAIL_SMTP_PORT),
    EMAIL_SMTP_USERNAME: String(process.env.EMAIL_SMTP_USERNAME),
    EMAIL_SMTP_SSL: Boolean(process.env.EMAIL_SMTP_SSL),
    EMAIL_SMTP_PASSWORD: String(process.env.EMAIL_SMTP_PASSWORD),
    EMAIL_NO_REPLY_ADDRESS: String(process.env.EMAIL_NO_REPLY_ADDRESS),
    SEED_EMAIL_ADDRESS: String(process.env.SEED_EMAIL_ADDRESS),
    SEED_PASSWORD: String(process.env.SEED_PASSWORD),
    SESSION_SECRET: String(process.env.SESSION_SECRET),
    SESSION_DURATION: Number(process.env.SESSION_DURATION),
};
