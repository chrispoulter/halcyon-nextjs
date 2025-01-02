'use server';

import { z } from 'zod';
import type { ChangePasswordResponse } from '@/app/profile/profile-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { verifySession } from '@/lib/session';

const schema = z.object({
    currentPassword: z
        .string({ message: 'Current Password must be a valid string' })
        .min(1, 'Current Password is a required field'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

type ChangePasswordActionValues = z.infer<typeof schema>;

export async function changePasswordAction(
    input: ChangePasswordActionValues
): Promise<ServerActionResult<ChangePasswordResponse>> {
    const { accessToken } = await verifySession();

    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    return await apiClient.put<ChangePasswordResponse>(
        '/profile/change-password',
        parsedInput.data,
        {
            Authorization: `Bearer ${accessToken}`,
        }
    );
}
