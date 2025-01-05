'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { apiClient } from '@/lib/api-client';
import { actionClient } from '@/lib/safe-action';
import { verifySession } from '@/lib/session';

export const getProfileAction = actionClient.action(async () => {
    const { accessToken } = await verifySession();

    return await apiClient.get<GetProfileResponse>('/profile', undefined, {
        Authorization: `Bearer ${accessToken}`,
    });
});
