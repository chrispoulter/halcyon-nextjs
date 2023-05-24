import { z } from 'zod';

export const createTokenSchema = z.object({
    emailAddress: z.string().email(),
    password: z.string().nonempty()
});

export type CreateTokenRequest = z.infer<typeof createTokenSchema>;
