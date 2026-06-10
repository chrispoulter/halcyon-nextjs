import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const config = createEnv({
    server: {
        APP_VERSION: z.string(),
        DATABASE_URL: z.url(),
        EMAIL_SMTP_SERVER: z.string().default('localhost'),
        EMAIL_SMTP_PORT: z.coerce.number().default(587),
        EMAIL_SMTP_SSL: z.coerce.boolean().default(false),
        EMAIL_SMTP_USERNAME: z.string().optional(),
        EMAIL_SMTP_PASSWORD: z.string().optional(),
        EMAIL_NO_REPLY_ADDRESS: z.email(),
        SESSION_SECRET: z.string().min(32),
        SESSION_DURATION: z.coerce.number().default(3600),
    },
    runtimeEnv: {
        APP_VERSION: process.env.APP_VERSION,
        DATABASE_URL: process.env.DATABASE_URL,
        EMAIL_SMTP_SERVER: process.env.EMAIL_SMTP_SERVER,
        EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT,
        EMAIL_SMTP_SSL: process.env.EMAIL_SMTP_SSL,
        EMAIL_SMTP_USERNAME: process.env.EMAIL_SMTP_USERNAME,
        EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
        EMAIL_NO_REPLY_ADDRESS: process.env.EMAIL_NO_REPLY_ADDRESS,
        SESSION_SECRET: process.env.SESSION_SECRET,
        SESSION_DURATION: process.env.SESSION_DURATION,
    },
    skipValidation: process.env.SKIP_ENV_VALIDATION === '1',
});
