'use server';

import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { Role } from '@/lib/session-types';
import { verifySession } from '@/lib/session';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
});

type GetUserActionValues = z.infer<typeof schema>;

export async function getUserAction(
    input: GetUserActionValues
): Promise<ServerActionResult<GetUserResponse>> {
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

    const { id } = parsedInput.data;

    return await apiClient.get<GetUserResponse>(`/user/${id}`, undefined, {
        Authorization: `Bearer ${accessToken}`,
    });
}
