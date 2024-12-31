'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { ActionError, authActionClient } from '@/lib/safe-action';

export const getProfileAction = authActionClient().action(
    async ({ ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/profile`, {
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

        return (await response.json()) as GetProfileResponse;
    }
);
