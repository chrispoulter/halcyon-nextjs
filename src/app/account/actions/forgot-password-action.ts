'use server';

import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        return await apiClient.put('/account/forgot-password', parsedInput);
    });
