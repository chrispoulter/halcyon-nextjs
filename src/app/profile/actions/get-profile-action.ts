'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { fetcher } from '@/lib/api-client';
import { authActionClient } from '@/lib/safe-action';

export const getProfileAction = authActionClient().action(
    async ({ ctx: { accessToken } }) => {
        return await fetcher<GetProfileResponse>('/profile', {
            accessToken,
        });
    }
);
