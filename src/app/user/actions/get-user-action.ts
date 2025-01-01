'use server';

import { forbidden, unauthorized } from 'next/navigation';
import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { authActionClient } from '@/lib/safe-action';
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
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}2`,
            },
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    return unauthorized();

                case 403:
                    return forbidden();

                default:
                    throw new Error(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        return (await response.json()) as GetUserResponse;
    });
