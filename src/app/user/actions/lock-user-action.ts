'use server';

import { z } from 'zod';
import type { LockUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { ActionError, authActionClient } from '@/lib/safe-action';
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
    .action(async ({ parsedInput: { id, ...rest }, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/user/${id}/lock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(rest),
        });

        if (!response.ok) {
            const error = response.headers
                .get('content-type')
                ?.includes('application/problem+json')
                ? await response.json()
                : await response.text();

            throw new ActionError(
                error?.title ||
                    error ||
                    `${response.status} ${response.statusText}`
            );
        }

        return (await response.json()) as LockUserResponse;
    });
