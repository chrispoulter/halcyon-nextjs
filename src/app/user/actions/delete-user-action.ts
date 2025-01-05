'use server';

import { z } from 'zod';
import type { DeleteUserResponse } from '@/app/user/user-types';
import { apiClient } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';
import { verifySession } from '@/lib/session';

const actionSchema = z.object(
    {
        id: z
            .string({ message: 'Id must be a valid string' })
            .uuid('Id must be a valid UUID'),
        version: z
            .number({ message: 'Version must be a valid number' })
            .optional(),
    },
    { message: 'Action Input is required' }
);

export const deleteUserAction = actionClient
    .schema(actionSchema)
    .action(async ({ parsedInput }) => {
        const { accessToken } = await verifySession([
            Role.SYSTEM_ADMINISTRATOR,
            Role.USER_ADMINISTRATOR,
        ]);

        return await apiClient.delete<DeleteUserResponse>(
            `/user/${parsedInput.id}`,
            parsedInput,
            {
                Authorization: `Bearer ${accessToken}`,
            }
        );
    });
