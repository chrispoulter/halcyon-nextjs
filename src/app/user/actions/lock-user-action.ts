'use server';

import { z } from 'zod';
import type { LockUserResponse } from '@/app/user/user-types';
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

type LockUserActionValues = z.infer<typeof schema>;

export async function lockUserAction(
    input: LockUserActionValues
): Promise<ServerActionResult<LockUserResponse>> {
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

    return await apiClient.put<LockUserResponse>(`/user/${id}/lock`, rest, {
        Authorization: `Bearer ${accessToken}`,
    });
}
