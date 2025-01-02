'use server';

import { z } from 'zod';
import { type SearchUsersResponse, UserSort } from '@/app/user/user-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

const schema = z.object({
    search: z.string({ message: 'Search must be a valid string' }).optional(),
    page: z.coerce
        .number({ message: 'Page must be a valid number' })
        .min(1, 'Page must be greater than zero')
        .optional(),
    size: z.coerce
        .number({ message: 'Size must be a valid number' })
        .min(1, 'Size must be greater than zero')
        .max(50, 'Size must be less than 50')
        .optional(),
    sort: z
        .nativeEnum(UserSort, { message: 'Sort must be a valid user sort' })
        .optional(),
});

type SearchUsersActionValues = z.infer<typeof schema>;

export async function searchUsersAction(
    input: SearchUsersActionValues
): Promise<ServerActionResult<SearchUsersResponse>> {
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

    return await apiClient.get<SearchUsersResponse>('/user', parsedInput.data, {
        Authorization: `Bearer ${accessToken}`,
    });
}
