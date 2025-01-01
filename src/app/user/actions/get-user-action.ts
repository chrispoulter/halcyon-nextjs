'use server';

import { forbidden, unauthorized } from 'next/navigation';
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

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    unauthorized();

                case 403:
                    forbidden();

                default:
                    const contentType =
                        response.headers.get('content-type') || '';

                    if (contentType.includes('application/problem+json')) {
                        const problem = await response.json();
                        throw new ActionError(problem.title);
                    }

                    throw new ActionError(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        return (await response.json()) as GetUserResponse;
    });
