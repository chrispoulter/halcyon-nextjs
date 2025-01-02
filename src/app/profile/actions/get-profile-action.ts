'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { verifySession } from '@/lib/session';

export async function getProfileAction(): Promise<
    ServerActionResult<GetProfileResponse>
> {
    const { accessToken } = await verifySession();

    return await apiClient.get<GetProfileResponse>('/profile', undefined, {
        Authorization: `Bearer ${accessToken}`,
    });
}
