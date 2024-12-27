'use server';

import { z } from 'zod';
import { DeleteAccountResponse } from '@/app/profile/profile-definitions';
import { config } from '@/lib/config';
import { actionClient } from '@/lib/safe-action';
import { verifySession, deleteSession } from '@/lib/session';

const schema = z.object({
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const deleteAccountAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const session = await verifySession();

        const response = await fetch(`${config.API_URL}/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(parsedInput),
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        deleteSession();

        return (await response.json()) as DeleteAccountResponse;
    });
