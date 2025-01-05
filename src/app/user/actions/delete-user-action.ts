'use server';

import { z } from 'zod';
import type { DeleteUserResponse } from '@/app/user/user-types';
import { apiClient } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const deleteUserAction = authActionClient(roles)
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        return await apiClient.delete<DeleteUserResponse>(
            `/user/${parsedInput.id}`,
            parsedInput,
            {
                Authorization: `Bearer ${accessToken}`,
            }
        );
    });
