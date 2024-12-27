'use server';

import { z } from 'zod';
import { ChangePasswordResponse } from '@/app/profile/profile-definitions';
import { config } from '@/lib/config';
import { actionClient } from '@/lib/safe-action';
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

export const changePasswordAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const session = await verifySession();

        const response = await fetch(
            `${config.API_URL}/profile/change-password`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify(parsedInput),
            }
        );

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        return (await response.json()) as ChangePasswordResponse;
    });
