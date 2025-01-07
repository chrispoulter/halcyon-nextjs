'use server';

import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { apiClient } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const getUserAction = authActionClient(roles)
    .schema(schema)
    .action(async ({ parsedInput: { id }, ctx: { accessToken } }) => {
        return await apiClient.get<GetUserResponse>(`/user/${id}`, undefined, {
            Authorization: `Bearer ${accessToken}`,
        });
    });
