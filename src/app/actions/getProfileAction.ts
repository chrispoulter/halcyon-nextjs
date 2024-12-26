'use server';

import { actionClient } from '@/lib/safe-action';
import { verifySession } from '@/lib/session';

export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version: string;
};

export const getProfileAction = actionClient.action(async () => {
    const session = await verifySession();

    const response = await fetch(`${process.env.API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('An error occurred while processing your request');
    }

    return (await response.json()) as GetProfileResponse;
});
