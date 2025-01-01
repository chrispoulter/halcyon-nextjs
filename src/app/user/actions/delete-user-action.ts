'use server';

import { z } from 'zod';
import type { DeleteUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const deleteUserAction = authActionClient([
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR,
])
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(rest),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/problem+json')) {
                const problem = await response.json();
                throw new ActionError(problem.title);
            }

            throw new ActionError(
                `HTTP ${response.status} ${response.statusText}`
            );
        }
        return (await response.json()) as DeleteUserResponse;
    });
