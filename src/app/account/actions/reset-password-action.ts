'use server';

import { z } from 'zod';
import type { ResetPasswordResponse } from '@/app/account/account-types';
import { config } from '@/lib/config';
import { actionClient, ActionError } from '@/lib/safe-action';

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
        const response = await fetch(
            `${config.API_URL}/account/reset-password`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedInput),
            }
        );

        if (!response.ok) {
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/problem+json')) {
                const problem = await response.json();
                throw new ActionError(problem.title);
            }

            throw new ActionError(
                `HTTP ${response.status} ${response.statusText}`
            );
        }

        return (await response.json()) as ResetPasswordResponse;
    });
