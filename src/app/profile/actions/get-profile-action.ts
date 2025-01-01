'use server';

import { unauthorized } from 'next/navigation';
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
            switch (response.status) {
                case 401:
                    unauthorized();

                default:
                    throw new Error(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        return (await response.json()) as GetProfileResponse;
    }
);
