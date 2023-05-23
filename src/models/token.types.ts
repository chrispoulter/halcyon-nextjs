import { z } from 'zod';

export const createTokenSchema = z.object({
    emailAddress: z.string().email(),
    password: z.string()
});

export type CreateTokenRequest = z.infer<typeof createTokenSchema>;
