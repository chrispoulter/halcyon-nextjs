'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const response = await fetch(
            `${process.env.API_URL}/account/forgot-password`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedInput),
            }
        );

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        return { success: 'Your forgot password request has been received' };
    });
