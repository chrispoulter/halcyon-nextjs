'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { apiClient } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';

export const getProfileAction = authActionClient().action(
    async ({ ctx: { accessToken } }) => {
        return await apiClient.get<GetProfileResponse>('/profile', undefined, {
            Authorization: `Bearer ${accessToken}`,
        });
    }
);
