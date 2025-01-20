'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { apiClient } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

const schema = z.object({
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const deleteAccountAction = authActionClient()
    .metadata({ actionName: 'deleteAccountAction' })
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const result = await apiClient.delete<DeleteAccountResponse>(
            '/profile',
            parsedInput,
            {
                Authorization: `Bearer ${accessToken}`,
            }
        );

        await deleteSession();

        return result;
    });
