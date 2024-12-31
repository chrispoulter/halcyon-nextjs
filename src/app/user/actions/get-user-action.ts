'use server';

import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
});

export const getUserAction = authActionClient([
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR,
])
    .schema(schema)
    .action(async ({ parsedInput: { id }, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/user/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 404) {
            return null;
        }

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

        return (await response.json()) as GetUserResponse;
    });
