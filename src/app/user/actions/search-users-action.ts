'use server';

import { forbidden, unauthorized } from 'next/navigation';
import { z } from 'zod';
import { type SearchUsersResponse, UserSort } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { authActionClient } from '@/lib/safe-action';
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

export const searchUsersAction = authActionClient([
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR,
])
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const params = new URLSearchParams(
            parsedInput as Record<string, string>
        );

        const response = await fetch(
            `${config.API_URL}/user?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

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

        return (await response.json()) as SearchUsersResponse;
    });
