'use server';

import { z } from 'zod';
import type { UnlockUserResponse } from '@/app/user/user-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { Role } from '@/lib/session-types';
import { verifySession } from '@/lib/session';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

type UnlockUserActionValues = z.infer<typeof schema>;

export async function unlockUserAction(
    input: UnlockUserActionValues
): Promise<ServerActionResult<UnlockUserResponse>> {
    const { accessToken } = await verifySession([
        Role.SYSTEM_ADMINISTRATOR,
        Role.USER_ADMINISTRATOR,
    ]);

    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    const { id, ...rest } = parsedInput.data;

    return await apiClient.put<UnlockUserResponse>(`/user/${id}/unlock`, rest, {
        Authorization: `Bearer ${accessToken}`,
    });
}
