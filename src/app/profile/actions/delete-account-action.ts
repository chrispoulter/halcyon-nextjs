'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient, isApiClientResultSuccess } from '@/lib/api-client';
import { deleteSession, verifySession } from '@/lib/session';

const schema = z.object({
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

type DeleteAccountActionValues = z.infer<typeof schema>;

export async function deleteAccountAction(
    input: DeleteAccountActionValues
): Promise<ServerActionResult<DeleteAccountResponse>> {
    const { accessToken } = await verifySession();

    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    const result = await apiClient.delete<DeleteAccountResponse>(
        '/profile',
        parsedInput.data,
        {
            Authorization: `Bearer ${accessToken}`,
        }
    );

    if (isApiClientResultSuccess(result)) {
        await deleteSession();
    }

    return result;
}
