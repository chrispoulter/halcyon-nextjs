'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { authActionClient } from '@/lib/safe-action';

export const getProfileAction = authActionClient().action(
    async ({ ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        return (await response.json()) as GetProfileResponse;
    }
);
