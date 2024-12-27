'use server';

import { z } from 'zod';
import type { ChangePasswordResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { authActionClient } from '@/lib/safe-action';

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

export const changePasswordAction = authActionClient()
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const response = await fetch(
            `${config.API_URL}/profile/change-password`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(parsedInput),
            }
        );

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        return (await response.json()) as ChangePasswordResponse;
    });
