'use server';

import { z } from 'zod';
import type { ChangePasswordResponse } from '@/app/profile/profile-types';
import { apiClient } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';
import { verifySession } from '@/lib/session';

const actionSchema = z.object(
    {
        currentPassword: z
            .string({ message: 'Current Password must be a valid string' })
            .min(1, 'Current Password is a required field'),
        newPassword: z
            .string({ message: 'New Password must be a valid string' })
            .min(8, 'New Password must be at least 8 characters')
            .max(50, 'New Password must be no more than 50 characters'),
        version: z
            .number({ message: 'Version must be a valid number' })
            .optional(),
    },
    { message: 'Action Input is required' }
);

export const changePasswordAction = actionClient
    .schema(actionSchema)
    .action(async ({ parsedInput }) => {
        const { accessToken } = await verifySession();

        return await apiClient.put<ChangePasswordResponse>(
            '/profile/change-password',
            parsedInput,
            {
                Authorization: `Bearer ${accessToken}`,
            }
        );
    });
