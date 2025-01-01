'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { ActionError, authActionClient } from '@/lib/safe-action';
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
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/problem+json')) {
                const problem = await response.json();
                throw new ActionError(problem.title);
            }

            throw new ActionError(
                `HTTP ${response.status} ${response.statusText}`
            );
        }

        await deleteSession();

        return (await response.json()) as DeleteAccountResponse;
    });
