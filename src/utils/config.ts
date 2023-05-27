import { z } from 'zod';

const schema = z.object({
    NODE_ENV: z.string().default('development'),
    NEXT_PUBLIC_GITVERSION_SEMVER: z.string().default('1.0.0'),
    DATABASE_URL: z.string(),
    EMAIL_SMTP_SERVER: z.string().default('localhost'),
    EMAIL_SMTP_PORT: z.coerce.number().default(1025),
    EMAIL_SMTP_USERNAME: z.string().optional(),
    EMAIL_SMTP_PASSWORD: z.string().optional(),
    EMAIL_NO_REPLY_ADDRESS: z.string().default('noreply@chrispoulter.com'),
    SEED_EMAIL_ADDRESS: z.string(),
    SEED_PASSWORD: z.string(),
    NEXT_AUTH_URL: z.string().default('http://localhost:3000'),
    NEXTAUTH_SECRET: z.string().default('change-me-1234567890'),
    NEXTAUTH_SESSION_MAXAGE: z.coerce.number().default(3600)
});

export const config = schema.parse(process.env);
