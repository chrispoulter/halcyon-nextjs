'use server';

import { GetProfileResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { actionClient } from '@/lib/safe-action';
import { verifySession } from '@/lib/session';

export const getProfileAction = actionClient.action(async () => {
    const session = await verifySession();

    const response = await fetch(`${config.API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('An error occurred while processing your request');
    }

    return (await response.json()) as GetProfileResponse;
});
