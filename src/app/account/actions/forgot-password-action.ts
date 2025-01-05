'use server';

import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';

const actionSchema = z.object(
    {
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .email('Email Address must be a valid email'),
    },
    { message: 'Action Input is required' }
);

export const forgotPasswordAction = actionClient
    .schema(actionSchema)
    .action(async ({ parsedInput }) => {
        return await apiClient.put('/account/forgot-password', parsedInput);
    });
