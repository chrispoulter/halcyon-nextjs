'use server';

import { z } from 'zod';
import type { ResetPasswordResponse } from '@/app/account/account-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';

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

type ResetPasswordActionValues = z.infer<typeof schema>;

export async function resetPasswordAction(
    input: ResetPasswordActionValues
): Promise<ServerActionResult<ResetPasswordResponse>> {
    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    return await apiClient.put<ResetPasswordResponse>(
        '/account/reset-password',
        parsedInput.data
    );
}
