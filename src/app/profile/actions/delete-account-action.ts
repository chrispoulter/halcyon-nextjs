'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { apiClient, isApiClientResultSuccess } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';
import { deleteSession, verifySession } from '@/lib/session';

const actionSchema = z.object({
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const deleteAccountAction = actionClient
    .schema(actionSchema)
    .action(async ({ parsedInput }) => {
        const { accessToken } = await verifySession();

        const result = await apiClient.delete<DeleteAccountResponse>(
            '/profile',
            parsedInput,
            {
                Authorization: `Bearer ${accessToken}`,
            }
        );

        if (isApiClientResultSuccess(result)) {
            await deleteSession();
        }
    });
