'use server';

import { unauthorized } from 'next/navigation';
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

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    unauthorized();

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

        return (await response.json()) as GetProfileResponse;
    }
);
