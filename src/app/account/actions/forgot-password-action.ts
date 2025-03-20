'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .metadata({ actionName: 'forgotPasswordAction' })
    .schema(schema)
    .action(async ({ parsedInput }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', parsedInput);
    });
