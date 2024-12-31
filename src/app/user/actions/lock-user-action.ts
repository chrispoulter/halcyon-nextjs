'use server';

import { z } from 'zod';
import type { LockUserResponse } from '@/app/user/user-types';
import { fetcher } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const lockUserAction = authActionClient([
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR,
])
    .schema(schema)
    .action(async ({ parsedInput: { id, ...json }, ctx: { accessToken } }) => {
        return await fetcher<LockUserResponse>(`/user/${id}/lock`, {
            method: 'PUT',
            accessToken,
            json,
        });
    });
