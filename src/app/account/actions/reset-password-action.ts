'use server';

import { z } from 'zod';
import type { ResetPasswordResponse } from '@/app/account/account-types';
import { apiClient } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';

const schema = z.object({
    token: z
        .string({ message: 'Token must be a valid string' })
        .uuid('Token must be a valid UUID'),
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
});

export const resetPasswordAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        return await apiClient.put<ResetPasswordResponse>(
            '/account/reset-password',
            parsedInput
        );
    });
