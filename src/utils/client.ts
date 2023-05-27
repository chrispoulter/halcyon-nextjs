import { z } from 'zod';

const schema = z.object({
    NEXT_PUBLIC_GITVERSION_SEMVER: z.string().default('1.0.0')
});

export const config = schema.parse(process.env);
