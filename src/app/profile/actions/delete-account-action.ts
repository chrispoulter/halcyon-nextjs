'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { fetcher } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

const schema = z.object({
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const deleteAccountAction = authActionClient()
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const result = await fetcher<DeleteAccountResponse>('/profile', {
            method: 'DELETE',
            accessToken,
            json: parsedInput,
        });

        await deleteSession();

        return result;
    });
