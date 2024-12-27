'use server';

import { z } from 'zod';
import type { DeleteUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { actionClient } from '@/lib/safe-action';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const deleteUserAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest } }) => {
        const session = await verifySession([
            Role.SYSTEM_ADMINISTRATOR,
            Role.USER_ADMINISTRATOR,
        ]);

        const response = await fetch(`${config.API_URL}/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(rest),
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        return (await response.json()) as DeleteUserResponse;
    });
