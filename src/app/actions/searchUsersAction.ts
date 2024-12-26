'use server';

import { z } from 'zod';
import { Role } from '@/lib/definitions';
import { actionClient } from '@/lib/safe-action';
import { verifySession } from '@/lib/session';

enum UserSort {
    EMAIL_ADDRESS_ASC = 'EMAIL_ADDRESS_ASC',
    EMAIL_ADDRESS_DESC = 'EMAIL_ADDRESS_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
}

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

export type SearchUsersItem = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    isLockedOut: boolean;
    roles?: Role[];
};

export type SearchUsersResponse = {
    items: SearchUsersItem[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export const getUserAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const session = await verifySession([
            Role.SYSTEM_ADMINISTRATOR,
            Role.USER_ADMINISTRATOR,
        ]);

        const params = Object.entries(parsedInput)
            .filter((pair) => !!pair[1])
            .map((pair) => pair.map(encodeURIComponent).join('='))
            .join('&');

        const response = await fetch(`${process.env.API_URL}/user?${params}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        return (await response.json()) as SearchUsersResponse;
    });
