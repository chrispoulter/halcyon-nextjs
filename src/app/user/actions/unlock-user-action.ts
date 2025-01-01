'use server';

import { forbidden, redirect } from 'next/navigation';
import { z } from 'zod';
import type { UnlockUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const unlockUserAction = authActionClient([
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR,
])
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/user/${id}/unlock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(rest),
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    await deleteSession();
                    redirect('/account/login');

                case 403:
                    forbidden();

                default:
                    throw new Error(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        return (await response.json()) as UnlockUserResponse;
    });
