'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

const schema = z.object({
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const deleteAccountAction = authActionClient()
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(parsedInput),
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        await deleteSession();

        return (await response.json()) as DeleteAccountResponse;
    });
